import nodemailer from 'nodemailer';

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
    host: "smtp.office365.com", // Outlook SMTP host
    port: 587,
    secure: false, // use STARTTLS
    auth: {
      user: process.env.EMAIL_USER, // your Outlook email
      pass: process.env.EMAIL_PASS, // your Outlook password or app password
    },
    tls: {
      ciphers: 'SSLv3',
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });

  console.log(`✅ Email sent to ${to}`);
};

export default sendEmail;
