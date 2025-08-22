const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send Welcome Email
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
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${to}`);
  } catch (error) {
    console.log('⚠️ Welcome email could not be sent');
  }
};

// Send Welcome Candidate Email
const sendWelcomeCandidateEmail = async (email, fullName, password) => {
  const mailOptions = {
    from: `${process.env.EMAIL_USER_NAME} <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `🎉 Welcome to ${process.env.EMAIL_USER_NAME}, ${fullName}!`,
    html: `
      <h1>Welcome, ${fullName}!</h1>
      <p>Your account has been successfully created.</p>
      <p><strong>Your login credentials:</strong></p>
      <p>Email: ${email}</p>
      <p>Password: ${password}</p>
      <p>Please use these credentials to log in and change your password for security.</p>
      <br>
      <p>Thank you for your enquiry. Our team will get in touch with you shortly regarding your interest in our programs.</p>
      <p>Meanwhile, feel free to explore more at our website or contact us directly.</p>
      <br>
      <p>Best regards,<br>${process.env.EMAIL_USER_NAME} Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome candidate email sent to ${email}`);
  } catch (error) {
    console.log('⚠️ Welcome candidate email could not be sent');
  }
};

// Send OTP Email
const sendOTPEmail = async (to, name, otp) => {
  const mailOptions = {
    from: `${process.env.EMAIL_USER_NAME} <${process.env.EMAIL_USER}>`,
    to,
    subject: `Your OTP for ${process.env.EMAIL_USER_NAME} Verification`,
    html: `
      <h3>Hi ${name},</h3>
      <p>Your One-Time Password (OTP) for account verification is:</p>
      <h2 style="color: #2e6da4;">${otp}</h2>
      <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
      <p>If you did not request this OTP, please ignore this email or contact our support team.</p>
      <br>
      <p>Regards,<br><strong>${process.env.EMAIL_USER_NAME} Team</strong></p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${to}`);
  } catch (error) {
    console.log('⚠️ OTP email could not be sent');
  }
};

module.exports = {
  sendWelcomeEmail,
  sendOTPEmail,
  sendWelcomeCandidateEmail
};
