const express = require('express');
const router = express.Router();
const serviceController = require('../Controllers/serviceController');
const createUpload = require('../middlewares/upload');

const uploadServiceImage = createUpload('service');

// CREATE
router.post('/', (req, res, next) => {
  uploadServiceImage(req, res, err => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}, serviceController.createService);

// READ
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);

// UPDATE
router.put('/:id', (req, res, next) => {
  uploadServiceImage(req, res, err => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}, serviceController.updateService);

// DELETE
router.delete('/:id', serviceController.hardDeleteService);

module.exports = router;
