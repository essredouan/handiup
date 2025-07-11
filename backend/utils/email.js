import nodemailer from 'nodemailer';

export const sendResetEmail = async (to, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Password Reset Request',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  };

  await transporter.sendMail(mailOptions);
};
