import Mailgen from "mailgen"
import nodemailer from "nodemailer"



export const sendMail = async(options) => { 
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "LogicVerse",
            link: `${process.env.FRONTEND_URL}`,
            logo: "https://res.cloudinary.com/dqj0v1x8g/image/upload/v1698236482/CodeBucks/logo.png"
        }
    })

    const emailText = mailGenerator.generatePlaintext(options.mailGenContent);
    const emailHtml = mailGenerator.generate(options.mailGenContent);

    const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  const mail = {
    from: process.env.MAILTRAP_FROM || '"LogicVerse" <noreply@logicverse.com>',
    to: options.email,
    subject: options.subject,
    text: emailText,
    html: emailHtml,
  }

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new ApiError('Email could not be sent', 500);
  }
}


export const forgotPasswordGenContent = (name, code) => {
  return {
    body: {
      name,
      intro: "You have requested to reset your password.",
      table: {
        data: [
          {
            Code: `**${code}**`, 
          },
        ],
        columns: {
          customWidth: { Code: '20%' },
          customAlignment: { Code: 'center' },
        },
      },
      outro: "Enter this code on the LogicVerse website to reset your password. If you didn't request this, please ignore the email.",
    },
  }
}