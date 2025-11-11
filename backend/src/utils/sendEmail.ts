import nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';

const sendEmail = async ({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.outlook.com", // Outlook SMTP host
    port: 587,
    secure: false, // use STARTTLS
    auth: {
      user: process.env.EMAIL_USER, // your Outlook email
      pass: process.env.EMAIL_PASS, // your Outlook password or app password
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized:false
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });

  console.log(`✅ Email sent to ${to}`, (error: any, info: SentMessageInfo) => {
      if (error) {
        return console.log("Mail error: ",error);
      }
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
};

export default sendEmail;
