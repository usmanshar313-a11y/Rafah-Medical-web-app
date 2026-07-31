const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { onRequest, onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const twilio = require("twilio");

initializeApp();
const db = getFirestore();

// ======================================================================================
// CONFIGURATION: TWILIO / SMS GATEWAY CREDENTIALS
// ======================================================================================
// TODO: Replace with real credentials before deploying, or better, move to Firebase Secrets (functions:secrets:set) for production.
const ACCOUNT_SID = "YOUR_ACCOUNT_SID_HERE";
const AUTH_TOKEN = "YOUR_AUTH_TOKEN_HERE";
const SENDER_NUMBER = "YOUR_SENDER_NUMBER_HERE";

/**
 * Helper function to normalize Pakistani or International phone numbers into E.164 format.
 * E.g., '03001234567' -> '+923001234567'
 */
function formatPhoneNumber(phone) {
  if (!phone) return null;
  let cleaned = phone.replace(/[\s\-\(\)]/g, "").trim();
  
  if (cleaned.startsWith("+")) {
    return cleaned;
  }
  if (cleaned.startsWith("00")) {
    return "+" + cleaned.slice(2);
  }
  if (cleaned.startsWith("03")) {
    return "+92" + cleaned.slice(1);
  }
  if (cleaned.startsWith("923")) {
    return "+" + cleaned;
  }
  
  // Return cleaned or prefixed with + if numeric
  return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
}

/**
 * Core function to handle sending SMS via Twilio with extensive error logging.
 */
async function sendCustomSms({ recipientPhone, messageBody, appointmentId }) {
  console.log(`[SMS-DEBUG] Preparing to send cancellation SMS for Appointment #${appointmentId}...`);
  console.log(`[SMS-DEBUG] Original Phone: "${recipientPhone}" | Message Body length: ${messageBody ? messageBody.length : 0} chars`);

  // Step 1: Validate Credentials Presence
  if (
    !ACCOUNT_SID ||
    !AUTH_TOKEN ||
    !SENDER_NUMBER ||
    ACCOUNT_SID.includes("YOUR_ACCOUNT_SID") ||
    AUTH_TOKEN.includes("YOUR_AUTH_TOKEN")
  ) {
    const err = new Error(
      "MISSING_CREDENTIALS: SMS service credentials are not configured in Cloud Functions. Please replace placeholder variables ACCOUNT_SID, AUTH_TOKEN, SENDER_NUMBER with valid Twilio credentials."
    );
    console.error(`[SMS-ERROR] ${err.message}`);
    throw err;
  }

  // Step 2: Validate & Normalize Phone Number
  const formattedPhone = formatPhoneNumber(recipientPhone);
  if (!formattedPhone || formattedPhone.length < 10) {
    const err = new Error(
      `INVALID_PHONE_FORMAT: Provided phone number "${recipientPhone}" could not be parsed into a valid phone number format (E.164 format expected, e.g. +923001234567).`
    );
    console.error(`[SMS-ERROR] ${err.message}`);
    throw err;
  }

  // Step 3: Validate Message Body
  if (!messageBody || messageBody.trim().length === 0) {
    const err = new Error("EMPTY_MESSAGE: Custom cancellation message cannot be empty.");
    console.error(`[SMS-ERROR] ${err.message}`);
    throw err;
  }

  console.log(`[SMS-DEBUG] Target E.164 Phone: "${formattedPhone}" | From Sender: "${SENDER_NUMBER}"`);

  // Step 4: Initialize Twilio Client & Dispatch Request
  try {
    const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

    const message = await client.messages.create({
      body: messageBody.trim(),
      from: SENDER_NUMBER,
      to: formattedPhone,
    });

    console.log(`[SMS-SUCCESS] SMS dispatched successfully! SID: ${message.sid} | Status: ${message.status}`);
    return {
      success: true,
      sid: message.sid,
      status: message.status,
      formattedPhone,
    };
  } catch (error) {
    // Step 5: Comprehensive Diagnostic Logging for Debugging Root Cause
    console.error(`[SMS-FAILURE] Twilio API Error encountered for Appointment #${appointmentId}:`);
    console.error(` -> Error Code: ${error.code || "N/A"}`);
    console.error(` -> Error Message: ${error.message}`);
    console.error(` -> More Info URL: ${error.moreInfo || "N/A"}`);
    console.error(` -> HTTP Status: ${error.status || "N/A"}`);

    let userFriendlyDiagnostic = error.message;

    if (error.code === 21211) {
      userFriendlyDiagnostic = `Invalid 'To' Phone Number (${formattedPhone}). Number is not a valid mobile destination.`;
    } else if (error.code === 20003) {
      userFriendlyDiagnostic = `Twilio Authentication Error. Please check ACCOUNT_SID and AUTH_TOKEN credentials.`;
    } else if (error.code === 21614) {
      userFriendlyDiagnostic = `'To' phone number ${formattedPhone} is not a valid mobile number or cannot receive SMS.`;
    } else if (error.code === 21606) {
      userFriendlyDiagnostic = `Sender number ${SENDER_NUMBER} is not owned or configured on this Twilio account.`;
    } else if (error.code === 21608) {
      userFriendlyDiagnostic = `Trial Account Restriction: Unverified phone number ${formattedPhone}. Verify phone number in Twilio console first.`;
    } else if (error.code === 20008) {
      userFriendlyDiagnostic = `Twilio Account is suspended or has insufficient balance/credits.`;
    }

    throw new Error(userFriendlyDiagnostic);
  }
}

/**
 * FIRESTORE TRIGGER: Automatically triggers when an appointment document is updated.
 * If status becomes 'cancelled' AND 'cancellationMessage' is provided AND 'smsSent' is not true,
 * it attempts to dispatch the custom SMS message.
 */
exports.onAppointmentCancelled = onDocumentUpdated(
  "appointments/{appointmentId}",
  async (event) => {
    const beforeData = event.data.before ? event.data.before.data() : {};
    const afterData = event.data.after ? event.data.after.data() : {};
    const appointmentId = event.params.appointmentId;

    // Check if status changed to 'cancelled' or custom cancellationMessage was added
    const isCancelledNow = afterData.status === "cancelled";
    const wasAlreadyCancelled = beforeData.status === "cancelled" && beforeData.smsSent === true;

    if (!isCancelledNow || wasAlreadyCancelled) {
      return null;
    }

    // Determine target phone number
    const targetPhone = afterData.patientPhone || afterData.phone;
    const customMessage = afterData.cancellationMessage;

    if (!customMessage) {
      console.log(`[SMS-TRIGGER] Appointment #${appointmentId} cancelled without custom message. Skipping SMS.`);
      return null;
    }

    try {
      const smsResult = await sendCustomSms({
        recipientPhone: targetPhone,
        messageBody: customMessage,
        appointmentId,
      });

      // Log success back onto document
      await db.collection("appointments").doc(appointmentId).update({
        smsSent: true,
        smsSentAt: new Date().toISOString(),
        smsError: null,
      });

      console.log(`[SMS-TRIGGER] Updated Appointment #${appointmentId} document with smsSent: true.`);
    } catch (err) {
      console.error(`[SMS-TRIGGER-FAIL] Appointment #${appointmentId} SMS send failed: ${err.message}`);

      // Log failure error back onto document
      await db.collection("appointments").doc(appointmentId).update({
        smsSent: false,
        smsError: err.message,
      });
    }
  }
);

/**
 * CALLABLE FUNCTION: Directly callable from Admin Dashboard UI to trigger SMS send on demand.
 */
exports.sendCancellationSms = onCall(async (request) => {
  const { appointmentId, patientPhone, cancellationMessage } = request.data || {};

  if (!appointmentId) {
    throw new HttpsError("invalid-argument", "Missing appointmentId parameter.");
  }

  try {
    const smsResult = await sendCustomSms({
      recipientPhone: patientPhone,
      messageBody: cancellationMessage,
      appointmentId,
    });

    // Update appointment document
    await db.collection("appointments").doc(appointmentId).update({
      status: "cancelled",
      cancellationMessage,
      smsSent: true,
      smsSentAt: new Date().toISOString(),
      smsError: null,
    });

    return { success: true, message: "Cancellation message sent via SMS successfully!" };
  } catch (err) {
    console.error(`[CALLABLE-SMS-FAIL] ${err.message}`);

    // Update document with failure state
    await db.collection("appointments").doc(appointmentId).update({
      status: "cancelled",
      cancellationMessage,
      smsSent: false,
      smsError: err.message,
    });

    throw new HttpsError("internal", err.message);
  }
});
