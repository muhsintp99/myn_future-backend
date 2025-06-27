const express = require('express');
const router = express.Router();
const serviceController = require('../Controllers/serviceController');
// const createUpload = require('../middlewares/upload');
const createUpload = require('../middlewares/cloudinaryUpload');

const uploadServiceImage = createUpload.createUpload('service');

// Routes
router.post('/', (req, res, next) => {
  uploadServiceImage(req, res, err => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}, serviceController.createService);

router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);

router.put('/:id', (req, res, next) => {
  uploadServiceImage(req, res, err => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}, serviceController.updateService);

router.patch('/:id', serviceController.softDeleteService);
router.delete('/:id', serviceController.hardDeleteService);
router.delete('/count', serviceController.totalServiceCount);

module.exports = router;
