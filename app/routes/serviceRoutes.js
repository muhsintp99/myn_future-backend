const express = require('express');
const router = express.Router();
const serviceController = require('../Controllers/serviceController');

// CREATE
router.post('/', serviceController.createService);

// READ
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);

// UPDATE
router.put('/:id', serviceController.updateService);

// DELETE
router.delete('/:id', serviceController.hardDeleteService);

module.exports = router;
