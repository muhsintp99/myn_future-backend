// const express = require('express');
// const router = express.Router();
// const collegeController = require('../Controllers/collegeController');
// const createUpload = require('../middlewares/upload');

// const uploadCollegeImage = createUpload('college');

// const handleUpload = (req, res, next) => {
//   uploadCollegeImage(req, res, err => {
//     if (err) return res.status(400).json({ error: err.message });
//     next();
//   });
// };

// router.post('/', handleUpload, collegeController.createCollege);
// router.get('/', collegeController.getColleges);
// router.get('/count', collegeController.getCollegeCount);
// router.get('/:id', collegeController.getCollegeById);
// router.put('/:id', handleUpload, collegeController.updateCollege);
// router.delete('/:id', collegeController.deleteCollege);

// module.exports = router;





const express = require('express');
const router = express.Router();
const collegeController = require('../Controllers/collegeController');
const createUpload = require('../middlewares/upload');
const mongoose = require('mongoose');

const uploadCollegeImage = createUpload('college');

const validateCollegeData = (req, res, next) => {
  const { category, courses, facilities, services } = req.body;

  if (category) {
    let parsedCategory;
    try {
      parsedCategory = typeof category === 'string' ? JSON.parse(category) : category;
      if (!Array.isArray(parsedCategory)) {
        return res.status(400).json({ error: 'Category must be an array' });
      }
      const validCategories = ['Graduate', 'Postgraduate', 'Diploma', 'PhD'];
      if (!parsedCategory.every(cat => validCategories.includes(cat))) {
        return res.status(400).json({ error: 'Invalid category values' });
      }
    } catch (err) {
      return res.status(400).json({ error: 'Invalid category format' });
    }
  }

  if (courses) {
    let parsedCourses;
    try {
      parsedCourses = typeof courses === 'string' ? JSON.parse(courses) : courses;
      if (!Array.isArray(parsedCourses)) {
        return res.status(400).json({ error: 'Courses must be an array' });
      }
      if (!parsedCourses.every(id => mongoose.isValidObjectId(id))) {
        return res.status(400).json({ error: 'Invalid course IDs' });
      }
    } catch (err) {
      return res.status(400).json({ error: 'Invalid courses format' });
    }
  }

  if (facilities !== undefined) {
    let parsedFacilities;
    try {
      parsedFacilities = typeof facilities === 'string' ? JSON.parse(facilities) : facilities;
      if (!Array.isArray(parsedFacilities)) {
        return res.status(400).json({ error: 'Facilities must be an array' });
      }
      if (!parsedFacilities.every(f => typeof f === 'string')) {
        return res.status(400).json({ error: 'Invalid facilities values' });
      }
    } catch (err) {
      return res.status(400).json({ error: 'Invalid facilities format' });
    }
  }

  if (services !== undefined) {
    let parsedServices;
    try {
      parsedServices = typeof services === 'string' ? JSON.parse(services) : services;
      if (!Array.isArray(parsedServices)) {
        return res.status(400).json({ error: 'Services must be an array' });
      }
      if (!parsedServices.every(s => typeof s === 'string')) {
        return res.status(400).json({ error: 'Invalid services values' });
      }
    } catch (err) {
      return res.status(400).json({ error: 'Invalid services format' });
    }
  }

  next();
};

const handleUpload = (req, res, next) => {
  uploadCollegeImage(req, res, err => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
};

router.post('/', validateCollegeData, handleUpload, collegeController.createCollege);
router.get('/', collegeController.getColleges);
router.get('/count', collegeController.getCollegeCount);
router.get('/:id', collegeController.getCollegeById);
router.put('/:id', validateCollegeData, handleUpload, collegeController.updateCollege);
router.delete('/:id', collegeController.deleteCollege);

module.exports = router;