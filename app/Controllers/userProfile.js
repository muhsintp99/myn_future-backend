// controllers/userProfileController.js
const multer = require('multer');
const UserProfile = require('../models/userProfile');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/Images');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB limit
  },
}).single('file');

const userProfileController = {
  createProfile: async (req, res) => {
    upload(req, res, async function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      try {
        // Process the uploaded file
        const filePath = req.file;

        // Save the file details to the database
        const newProfile = new UserProfile({
          filename: req.file.filename,
          // Add more fields as needed
        });

        await newProfile.save();

        return res.status(201).json({ message: 'Profile created successfully', filePath });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    });
  },

  getAllProfiles: async (req, res) => {
    try {
      const profiles = await UserProfile.find();
      return res.status(200).json(profiles);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
 

  updateProfileImage: async (req, res) => {
    const { id } = req.params;
    upload(req, res, async function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      try {
        const updatedProfile = await UserProfile.findByIdAndUpdate(id, { filename: req.file.filename }, { new: true });
        return res.status(200).json(updatedProfile);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    });
  },

  deleteProfile: async (req, res) => {
    const { id } = req.params;
    try {
      await UserProfile.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Profile deleted successfully' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

module.exports = userProfileController;
