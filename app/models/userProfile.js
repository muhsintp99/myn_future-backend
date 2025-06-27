// userProfile.js (model)
const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  filename: String,
  // Add more fields as needed
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;
