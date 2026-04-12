/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {setGlobalOptions} = require("firebase-functions");
// const {onRequest} = require("firebase-functions/https");
// const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
// setGlobalOptions({maxInstances: 10});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Mailgun email function
const functions = require("firebase-functions/v1");
const mailgun = require("mailgun-js");
const admin = require("firebase-admin");
admin.initializeApp();

exports.getAvailableTimes = functions
    .region("us-central1")
    .https.onCall(async (data, context) => {
      const {date, duration} = data;

      if (!context.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "You must be logged in.",
        );
      }

      if (!date || !duration) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "Date and duration are required.",
        );
      }

      const appointmentsRef = admin.firestore().collection("appointments");
      const snapshot = await appointmentsRef.where("date", "==", date).get();

      // Convert booked appointments into time ranges
      const bookedRanges = snapshot.docs.map(doc => {
        const {time, duration: bookedDuration} = doc.data();
        return {
          start: time,
          end: addMinutes(time, bookedDuration || 60),
        };
      });

      const allSlots = [
        "9:00 AM",
        "10:00 AM",
        "11:00 AM",
        "1:00 PM",
        "2:00 PM",
        "3:00 PM",
      ];

      const openSlots = allSlots.filter(slot => {
        const slotStart = slot;
        const slotEnd = addMinutes(slot, duration);

        // Check overlap
        return !bookedRanges.some(range => 
          timeRangesOverlap(slotStart, slotEnd, range.start, range.end)
        );
      });

      return {openSlots};
    });

// Helper functions

/**
 * Adds minutes to a time string and returns the new time.
 * @param {string} timeStr - The time in "H:MM AM/PM" format.
 * @param {number} minutes - The number of minutes to add.
 * @return {string} The new time in "H:MM AM/PM" format.
 */
function addMinutes(timeStr, minutes) {
  const [time, modifier] = timeStr.split(" ");
  let [hours, mins] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  const date = new Date();
  date.setHours(hours);
  date.setMinutes(mins + minutes);

  return formatTime(date);
}

/**
 * Formats a Date object to a time string in "H:MM AM/PM" format.
 * @param {Date} date - The Date object to format.
 * @return {string} The formatted time string.
 */
function formatTime(date) {
  let hours = date.getHours();
  const mins = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  return `${hours}:${mins} ${ampm}`;
}

/**
 * Checks if two time ranges overlap.
 * @param {string} start1 - The start time of the first range.
 * @param {string} end1 - The end time of the first range.
 * @param {string} start2 - The start time of the second range.
 * @param {string} end2 - The end time of the second range.
 * @return {boolean} True if the ranges overlap, false otherwise.
 */
function timeRangesOverlap(start1, end1, start2, end2) {
  return start1 < end2 && start2 < end1;
}


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
