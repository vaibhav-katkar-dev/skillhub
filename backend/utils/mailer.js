import { Resend } from 'resend';

/**
 * Sends an email using Resend.
 * @param {Object} params 
 * @param {string|string[]} params.to - Recipient email address(es)
 * @param {string} params.subject - Email subject
 * @param {string} params.html - HTML body of the email
 */
export const sendEmail = async ({ to, subject, html }) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[Email] RESEND_API_KEY not set — skipping send. Email was:', { to, subject });
    return;
  }
  const resend = new Resend(apiKey);
  const from = process.env.EMAIL_FROM || 'SkillValix <onboarding@resend.dev>';
  
  const { error } = await resend.emails.send({ from, to, subject, html });
  if (error) {
    console.error('[Email] Resend error:', error);
    throw new Error(error.message || 'Failed to send email via Resend');
  }
};
