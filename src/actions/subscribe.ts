"use server";

import mailchimp from "@mailchimp/mailchimp_marketing";
import nodemailer from "nodemailer";
import { SubscribeFormSchema } from "@/components/footer/schema";
import { render } from "@react-email/render";
import WelcomingEmail from "@/emails/welcome";

if (
  !process.env.MAILCHIMP_API_KEY ||
  !process.env.MAILCHIMP_SERVER_PREFIX ||
  !process.env.MAILCHIMP_AUDIENCE_ID ||
  !process.env.GMAIL_USER ||
  !process.env.GMAIL_PASS ||
  !process.env.RECAPCHA_BACKEND_KEY
) {
  throw new Error(
    "Missing required environment variables. Check MAILCHIMP_API_KEY, MAILCHIMP_SERVER_PREFIX, MAILCHIMP_AUDIENCE_ID, GMAIL_USER, GMAIL_PASS, RECAPCHA_BACKEND_KEY."
  );
}

const SECRET_KEY = process.env.RECAPCHA_BACKEND_KEY;

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY!,
  server: process.env.MAILCHIMP_SERVER_PREFIX!,
});

export async function subscribeUser(
  formData: SubscribeFormSchema,
  token: string | undefined
) {
  try {
    if (!token) {
      return { success: false, message: "CAPTCHA token is missing" };
    }

    const { email } = formData;

    const verificationResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: SECRET_KEY || "",
          response: token,
        }),
      }
    );

    // console.log("verificationResponse", verificationResponse);

    const verificationResult = await verificationResponse.json();

    if (!verificationResult.success || verificationResult.score < 0.5) {
      // If the score is too low, reject the submission
      return {
        success: false,
        message: "CAPTCHA verification failed. You might be a bot!",
      };
    }

    await mailchimp.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID!, {
      email_address: email,
      status: "subscribed", // or "pending" for double opt-in
    });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const html = await render(WelcomingEmail(), { pretty: true });
    const text = await render(WelcomingEmail(), { plainText: true });

    await transporter.sendMail({
      from: `My Newsletter${process.env.GMAIL_USER}`,
      to: email,
      subject: "Welcome to Oracle's Newsletter!",
      html,
      text,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in subscribeUser:", error);
      throw error;
    }
  }
}
