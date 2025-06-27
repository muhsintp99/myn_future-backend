const express = require('express');
const router = express.Router();

const contactController = require('../Controllers/contactController');

// Create new contact message
router.post('/', contactController.createContact);

// Get all contact messages
router.get('/', contactController.getContacts);

// Update status of a contact message
router.put('/:id/status', contactController.updateStatus);

// Hard delete a single contact message
router.delete('/:id', contactController.deleteContact);

// Hard delete all contact messages
router.delete('/', contactController.deleteAllContacts);

// Get count of messages
router.get('/count', contactController.getCount);

module.exports = router;
