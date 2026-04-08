import { Resend } from 'resend';
import { config } from '../config/env.js';

const resend = new Resend(config.resend.apiKey);

export async function sendConfirmation(params: { name: string; email: string; appointmentTime: string; service?: string }) {
  console.log(`[Tool: sendConfirmation] Executing with params:`, params);

  if (!config.resend.apiKey) {
    console.warn("Resend API Key not configured, skipping email dispatch.");
    return { status: "success", message: "Mock email sent." };
  }

  const emailBody = `
    Hi ${params.name},

    Your appointment for ${params.service || 'our services'} is confirmed for ${params.appointmentTime}.
    We look forward to speaking with you! If you need to reschedule, please reply to this email.

    Best regards,
    The Team
  `;

  try {
    const data = await resend.emails.send({
      from: config.resend.fromEmail,
      to: params.email,
      subject: `Appointment Confirmation: ${params.service || 'Service'}`,
      text: emailBody,
    });
    return { status: "success", data };
  } catch (error: any) {
    console.error("Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
