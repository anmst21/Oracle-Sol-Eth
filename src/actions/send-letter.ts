"use server";

import { FormSchema } from "@/components/contacts-form/form-schema";

const SECRET_KEY = process.env.RECAPCHA_BACKEND_KEY;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const formatMessage = (formData: FormSchema) => {
  return `
🚨 *New Contact Request for Oracle* 🚨

👤 *Name*: ${formData.name}
📧 *Email*: ${formData.email}
📞 *Phone*: ${formData.phone || "Not provided"}
🎟️ *Subject*: ${formData.subject || "Not provided"}
💬 *Message*: ${formData.message}

✅ *Consent Provided*: ${formData.consent ? "Yes" : "No"}
  `;
};
export const sendLetter = async (
  formData: FormSchema,
  token: string | undefined
) => {
  try {
    // if (!token) {
    //   return { success: false, message: "CAPTCHA token is missing" };
    // }

    // // Verify the CAPTCHA token with Google
    // const verificationResponse = await fetch(
    //   `https://www.google.com/recaptcha/api/siteverify`,
    //   {
    //     method: "POST",
    //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //     body: new URLSearchParams({
    //       secret: SECRET_KEY || "",
    //       response: token,
    //     }),
    //   }
    // );

    // const verificationResult = await verificationResponse.json();

    // if (!verificationResult.success || verificationResult.score < 0.5) {
    //   // If the score is too low, reject the submission
    //   return {
    //     success: false,
    //     message: "CAPTCHA verification failed. You might be a bot!",
    //   };
    // }

    // If CAPTCHA verification is successful, format the message
    const message = formatMessage(formData);

    // Send the formatted message to Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown", // Use Markdown formatting for the message
        }),
      }
    );

    const telegramResult = await telegramResponse.json();

    if (!telegramResult.ok) {
      return {
        success: false,
        message: `Failed to send message to Telegram: ${telegramResult.description}`,
      };
    }

    // console.log("Form Data Submitted to Telegram:", message);

    return { success: true, message: "Form submitted successfully" };
  } catch (error) {
    console.error(
      "Error during CAPTCHA verification or form submission:",
      error
    );
    return {
      success: false,
      message: "An error occurred during submission. Please try again later.",
    };
  }
};
