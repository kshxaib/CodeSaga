import {Resend} from 'resend';
import { getForgotPasswordHtml } from '../emails/getForgotPasswordHtml.js';
import { getWelcomeEmailHtml } from '../emails/getWelcomeEmailHtml.js';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async(name, email, code, subject) => {
  const { data, error } = await resend.emails.send({
    from: 'LogicVerse Support <support@resend.dev>',
    to: [email],
    subject: subject,
    html: subject === 'Reset Your Password' ? getForgotPasswordHtml(name, code) : getWelcomeEmailHtml(name),
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
}

