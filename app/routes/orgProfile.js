const express = require('express');
const orgProfileController = require('../Controllers/orgProfile');
const fs = require("fs");
const router = express.Router();

const multer = require('multer');

/*
// Image upload configuration
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});

var upload = multer({
    storage: storage,
}).single("logo");
*/
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
});



// Create Organization Profile
router.post('/', upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'document', maxCount: 1 }]), orgProfileController.createOrgProfile);

/*
router.post('/',upload,orgProfileController.createOrgProfile);
*/


// Get all Organization Profiles
router.get('/', orgProfileController.getAllOrgProfiles);

// Get Organization Profile by ID
router.get('/:id', orgProfileController.getSingleOrgProfile); 

// Get user profile by userId


// Update Organization Profile by ID
router.put('/:id', orgProfileController.updateOrgProfile);


// Soft Delete Organization Profile by ID
router.patch('/:Id', orgProfileController.softDeleteOrgProfile);

module.exports = router;
