import {Resend} from 'resend';
import { getForgotPasswordHtml } from '../emails/getForgotPasswordHtml.js';
import { getWelcomeEmailHtml } from '../emails/getWelcomeEmailHtml.js';
import { getGoogleWelcomeEmailHtml } from '../emails/getGoogleWelcomeEmailHtml.js';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async(name="", email="", code="", subject="", password = null) => {
  let html;
  
  if (subject === 'Reset Your Password') {
    html = getForgotPasswordHtml(name, code);
  } 
  else if (subject === 'Welcome to LogicVerse - Your Account Details') {
    html = getGoogleWelcomeEmailHtml(name, password);
  }
  else {
    html = getWelcomeEmailHtml(name);
  }

  const { data, error } = await resend.emails.send({
    from: 'LogicVerse Support <support@resend.dev>',
    to: [email],
    subject: subject,
    html: html
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
}

