const express = require('express');
const router = express.Router();
const followUpController = require('../Controllers/followUp');

// Create a FollowUp
router.post('/', followUpController.CreateFollowUp);

// Get all FollowUps
router.get('/', followUpController.GetAllFollowUps);

// Get a single FollowUp by ID
router.get('/:id', followUpController.GetSingleFollowUp);


//get all followup for enquiry
router.get('/enqId/:enquiryId', followUpController.GetAllFollowUpsForEnquiry);

// Update a FollowUp by ID
router.put('/:id', followUpController.UpdateFollowUp);

// Soft Delete a FollowUp by ID
router.patch('/:id', followUpController.softDeleteFollowUp);
router.delete('/:id', followUpController.deleteFollowUp);

module.exports = router;