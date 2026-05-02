import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: 'vaibhavkatkar123@gmail.com', // Using a placeholder, I'll ask the user for theirs or use a dummy
      subject: 'Test Email',
      html: '<p>Test</p>'
    });

    if (error) {
      console.error('Resend Error:', error);
    } else {
      console.log('Resend Success:', data);
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

testEmail();
