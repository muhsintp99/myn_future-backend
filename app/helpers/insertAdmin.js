const path = require('path');
const fs = require('fs');
const User = require('../models/user');
const { hashPassword } = require('./authHelper');
const { sendWelcomeEmail } = require('./sendEmail');
require('dotenv').config();

const insertDefaultAdmin = async () => {
  try {
    const exists = await User.findOne({ email: 'muhsintp.develop@gmail.com' });
    if (exists) {
      console.log('👤 Admin already exists.');
      return;
    }

    const fileName = 'Admin.png';
    const relPath = `/public/defult/${fileName}`;

    const imagePath = path.join(__dirname, '../../public/defult', fileName);

    if (!fs.existsSync(imagePath)) {
      console.warn(`⚠️ Admin image not found at: ${imagePath}`);
      return;
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:2022';
    const fullImage = `${baseUrl}${relPath}`;

    const hashedPassword = await hashPassword('123456');

    const admin = await User.create({
      fname: 'muhsin',
      lname: 'admin',
      email: 'muhsintp.develop@gmail.com',
      mobile: '8593856881',
      password: hashedPassword,
      userType: 'admin',
      image: fullImage
    });

    try {
      await sendWelcomeEmail(admin.email, `${admin.fname} ${admin.lname}`);
      console.log('✅ Welcome email sent to admin');
    } catch (err) {
      console.error('⚠️ Send welcome email error:', err);
    }

    console.log('✅ Default admin created');
  } catch (err) {
    console.error('❌ Error creating default admin:', err.message);
  }
};

module.exports = { insertDefaultAdmin };
