// functions/index.js (or your functions entry file)
const functions = require("firebase-functions");
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Helper: format Date to "H:MM AM/PM"
 * @param {Date} date - The date object to format
 * @return {string} The formatted time string (e.g., "9:00 AM")
 */
function formatTime(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const mins = minutes.toString().padStart(2, "0");
  return `${hours}:${mins} ${ampm}`;
}

/**
 * Helper: parse "H:MM AM/PM" into minutes since midnight
 * @param {string} timeStr - The time string in "H:MM AM/PM" format
 * @return {number} The total minutes since midnight
 */
function parseToMinutes(timeStr) {
  const [time, modifier] = timeStr.split(" ");
  let [hours, mins] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return hours * 60 + mins;
}

/**
 * Helper: add minutes to "H:MM AM/PM" and return new "H:MM AM/PM"
 * @param {string} timeStr - The time string in "H:MM AM/PM" format
 * @param {number} minutesToAdd - The number of minutes to add
 * @return {string} The new time string in "H:MM AM/PM" format
 */
function addMinutes(timeStr, minutesToAdd) {
  const total = parseToMinutes(timeStr) + minutesToAdd;
  const hours = Math.floor((total % (24 * 60)) / 60);
  const mins = total % 60;
  const date = new Date();
  date.setHours(hours, mins, 0, 0);
  return formatTime(date);
}

/**
 * Helper: check overlap between two ranges given as "H:MM AM/PM"
 * @param {string} aStart - Start time of range A in "H:MM AM/PM" format
 * @param {string} aEnd - End time of range A in "H:MM AM/PM" format
 * @param {string} bStart - Start time of range B in "H:MM AM/PM" format
 * @param {string} bEnd - End time of range B in "H:MM AM/PM" format
 * @return {boolean} True if the two time ranges overlap, false otherwise
 */
function timeRangesOverlap(aStart, aEnd, bStart, bEnd) {
  const aS = parseToMinutes(aStart);
  const aE = parseToMinutes(aEnd);
  const bS = parseToMinutes(bStart);
  const bE = parseToMinutes(bEnd);
  return aS < bE && bS < aE;
}

exports.getAvailableTimes = functions
  .region("us-central1")
  .https.onCall(async (data, context) => {
    const { date, duration } = data;

    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "You must be logged in.");
    }

    if (!date || !duration) {
      throw new functions.https.HttpsError("invalid-argument", "Date and duration are required.");
    }

    try {
      const appointmentsRef = admin.firestore().collection("appointments");
      const snapshot = await appointmentsRef.where("date", "==", date).get();

      // Convert booked appointments into time ranges
      const bookedRanges = snapshot.docs.map((d) => {
        const { time, duration: bookedDuration } = d.data();
        const bookedDur = Number(bookedDuration) || 60;
        return {
          start: time,
          end: addMinutes(time, bookedDur),
        };
      });

      const allSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM"];

      const openSlots = allSlots.filter((slot) => {
        const slotStart = slot;
        const slotEnd = addMinutes(slot, Number(duration));
        return !bookedRanges.some((range) =>
          timeRangesOverlap(slotStart, slotEnd, range.start, range.end)
        );
      });

      // Return a consistent field name the client expects
      return { openSlots };
    } catch (err) {
      console.error("getAvailableTimes error:", err);
      throw new functions.https.HttpsError("internal", "Failed to compute availability.");
    }
  });

exports.sendAppointmentEmail = functions
    .runWith({timeoutSeconds: 30, memory: "256MB"}) // forces Gen1
    .https.onCall(async (data, context) => {
      const {email, name, date, time} = data;

      const mg = mailgun({
        apiKey: functions.config().mailgun.key,
        domain: functions.config().mailgun.domain,
      });

      const messageData = {
        from: functions.config().mailgun.from,
        to: email,
        subject: "Your Appointment Confirmation",
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Appointment Confirmed</h2>
          <p>Hi ${name},</p>
          <p>Your appointment has been successfully booked.</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <br/>
          <p>Thank you for choosing us!</p>
        </div>
      `,
      };

      try {
        await mg.messages().send(messageData);
        return {success: true};
      } catch (error) {
        console.error("Mailgun Error:", error);
        return {success: false, error: error.message};
      }
    });
