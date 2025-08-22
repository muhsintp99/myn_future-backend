const express = require('express');
const router = express.Router();
const collegeController = require('../Controllers/collegeController');
const createUpload = require('../middlewares/upload');

const uploadCollegeImage = createUpload('college');

const handleUpload = (req, res, next) => {
  uploadCollegeImage(req, res, err => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
};

router.post('/', handleUpload, collegeController.createCollege);
router.get('/', collegeController.getColleges);
router.get('/count', collegeController.getCollegeCount);
router.get('/:id', collegeController.getCollegeById);
router.put('/:id', handleUpload, collegeController.updateCollege);
router.delete('/:id', collegeController.deleteCollege);

module.exports = router;