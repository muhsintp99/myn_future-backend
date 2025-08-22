const path = require('path');
const fs = require('fs');
const Country = require('../models/country');
require('dotenv').config(); // To access BASE_URL from .env

async function seedDefaultIndiaCountry() {
  try {
    const exists = await Country.findOne({ name: 'India' });
    if (exists) {
      console.log("ℹ️ 'India' already exists.");
      return;
    }

    const fileName = 'India.png';
    const sourcePath = path.join(__dirname, '../../public/defult', fileName);
    const destDir = path.join(__dirname, '../../public/country');
    const destPath = path.join(destDir, fileName);

    // Ensure source image exists
    if (!fs.existsSync(sourcePath)) {
      console.warn(`⚠️ Source image not found: ${sourcePath}`);
      return;
    }

    // Create destination directory if missing
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    // Copy image if not already copied
    if (!fs.existsSync(destPath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log('📁 Copied India.png to public/country/');
    }

    // Use environment-based BASE_URL
    const baseUrl = process.env.BASE_URL || 'http://localhost:2022';
    const image = `${baseUrl}/public/country/${fileName}`;

    const india = new Country({
      name: 'India',
      code: 'IN',
      isoCode: 'IND',
      dialCode: '+91',
      currency: 'INR',
      image,
      isDomestic: true,
      isDefault: true
    });

    await india.save();
    console.log("✅ 'India' inserted with image:", image);
  } catch (err) {
    console.error("❌ Failed to insert India:", err.message);
  }
}

module.exports = seedDefaultIndiaCountry;
