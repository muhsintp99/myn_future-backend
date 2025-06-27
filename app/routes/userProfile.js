// userProfile.js (router)
const express = require('express');
const userProfileController = require('../Controllers/userProfile');

const router = express.Router();

router.post('/create', userProfileController.createProfile);
router.get('/all', userProfileController.getAllProfiles);
// router.get('/:id', userProfileController.getProfileById);
router.put('/updateImage/:id', userProfileController.updateProfileImage);
router.delete('/:id', userProfileController.deleteProfile);

module.exports = router;
