// utils/sendEmail.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        name: process.env.EMAIL_USER_NAME
    }
});

const sendWelcomeEmail = async (to, name) => {
    const mailOptions = {
        from: `${process.env.EMAIL_USER_NAME} <${process.env.EMAIL_USER}>`,
        to,
        subject: `🎉 Welcome to ${process.env.EMAIL_USER_NAME}, ${name}!`,
        html: `
      <h3>Hi ${name},</h3>
      <p>Thank you for your enquiry. Our team will get in touch with you shortly regarding your interest in our programs.</p>
      <p>Meanwhile, feel free to explore more at our website or contact us directly.</p>
      <br>
      <p>Regards,<br><strong>${process.env.EMAIL_USER_NAME} Team</strong></p>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Welcome email sent to ${to}`);
    } catch (err) {
        console.error('❌ Failed to send welcome email:', err.message);
    }
};

module.exports = { sendWelcomeEmail };
