const express = require('express');
const enquiryController = require('../Controllers/enquiry'); 

const router = express.Router();

// Create a new enquiry
router.post('/', enquiryController.CreateEnquiryController);

// Get all enquiries
router.get('/', enquiryController.GetAllEnquiriesController);

// Get new enquiry count
router.get('/new/count', enquiryController.getNewEnquiryCount);

// Get enquiry count (place this before `/:id` route)
router.get('/total/count', enquiryController.enquiryCount);

// Get a single enquiry by ID
router.get('/:id', enquiryController.GetSingleEnquiryController);

// Update an existing enquiry by ID
router.put('/:id', enquiryController.UpdateEnquiryController);

// Update enquiry status to active
router.put('/status/:id', enquiryController.UpdateEnquiryStatus);

// Soft delete an enquiry by ID
router.patch('/:id', enquiryController.softDelete);

module.exports = router;