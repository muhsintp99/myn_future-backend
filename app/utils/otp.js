const crypto = require('crypto');

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
};

const generateTokenExpiry = () => {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 10); // OTP valid for 10 minutes
  return expiry;
};

module.exports = { generateOTP, generateTokenExpiry };