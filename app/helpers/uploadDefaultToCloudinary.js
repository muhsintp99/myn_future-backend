const { v2: cloudinary } = require('cloudinary');
const path = require('path');

async function uploadDefaultImage(localPath, folderName = 'default') {
  try {
    const absolutePath = path.resolve(localPath);
    const result = await cloudinary.uploader.upload(absolutePath, {
      folder: folderName,
      transformation: [{ width: 800, height: 800, crop: 'limit' }]
    });
    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    throw err;
  }
}

module.exports = uploadDefaultImage;
