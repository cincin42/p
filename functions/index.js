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
