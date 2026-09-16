import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export const sendEmail = async ({ to, subject, html }: { to: string; subject: string; html: string }) => {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_resend_api_key_here') {
    console.warn('⚠️ [RESEND WARNING] RESEND_API_KEY is missing or invalid in .env.local.');
    console.log(`\n=== MOCK EMAIL (Requires API Key) ===\nTo: ${to}\nSubject: ${subject}\n\n${html}\n======================================\n`);
    return null;
  }

  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to,
      subject,
      html,
    });

    console.log(`✅ Email successfully sent via Resend. ID: ${data.data?.id}`);
    return data;
  } catch (error) {
    console.error('Error sending email via Resend:', error);
    throw new Error('Failed to send email via Resend');
  }
};
