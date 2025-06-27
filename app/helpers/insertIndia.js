const path = require('path');
const Country = require('../models/country');
const uploadDefaultImage = require('./uploadDefaultToCloudinary');

async function seedDefaultIndiaCountry() {
  try {
    const exists = await Country.findOne({ name: 'India', isDeleted: false });

    if (!exists) {
      // Safe absolute path (IMPORTANT PART ✅)
      const imagePath = path.join(__dirname, '../../public/defult/India.png');
      const uploadResult = await uploadDefaultImage(imagePath, 'country');

      const india = new Country({
        name: 'India',
        code: 'IN',
        isoCode: 'IND',
        dialCode: '+91',
        currency: 'INR',
        image: uploadResult.url,
        publicId: uploadResult.publicId,
        createdBy: 'system',
        updatedBy: 'system'
      });

      await india.save();
      console.log("✅ 'India' inserted and image uploaded to Cloudinary.");
    } else {
      console.log("ℹ️ 'India' already exists.");
    }
  } catch (err) {
    console.error("❌ Failed to insert India:", err.message);
  }
}

module.exports = seedDefaultIndiaCountry;
