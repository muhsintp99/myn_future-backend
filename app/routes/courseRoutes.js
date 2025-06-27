// courseRoutes.js (no changes needed)
const express = require('express');
const router = express.Router();
const courseController = require('../Controllers/courseController');
// const createUpload = require('../middlewares/upload');
const createUpload = require('../middlewares/cloudinaryUpload');

const { requireSignIn, isAdminOrLicensee } = require('../middlewares/authMiddleware');

const uploadCoursesImage = createUpload.createUpload('courses');

// Create
router.post('/',
    requireSignIn,
    isAdminOrLicensee,
    (req, res, next) => {
        uploadCoursesImage(req, res, err => {
            if (err) return res.status(400).json({ error: err.message });
            next();
        });
    },
    courseController.createCourse);

// Read
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// Update
router.put('/:id',
    requireSignIn,
    isAdminOrLicensee,
    (req, res, next) => {
        uploadCoursesImage(req, res, err => {
            if (err) return res.status(400).json({ error: err.message });
            next();
        });
    },
    courseController.updateCourse);

// Delete
router.delete('/:id', requireSignIn, isAdminOrLicensee, courseController.deleteCourse);

module.exports = router;