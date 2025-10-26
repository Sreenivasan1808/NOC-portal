import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, text }: { to: string; subject: string; text: string; }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port:587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
};

export default sendEmail;
