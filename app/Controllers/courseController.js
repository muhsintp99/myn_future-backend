// courseController.js (no changes needed)
const Course = require('../models/course');

// Create new course
exports.createCourse = async (req, res) => {
  try {
    // const image = req.file ? `/public/courses/${req.file.filename}` : null;
    const image = req.file ? req.file.path : null;


    const courseData = {
      ...req.body,
      image, // set image path to course data
      createdBy: req.user?.role || 'admin',
      updatedBy: req.user?.role || 'admin'
    };

    const course = new Course(courseData);
    await course.save();

    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const visible = req.query.visible;
    let filter = { isDeleted: false };
    if (visible !== undefined) filter.visible = visible === 'true';

    const courses = await Course.find(filter);
    const count = await Course.countDocuments(filter);

    res.json({ message: 'Courses fetched', data: courses, count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course || course.isDeleted) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    // const image = req.file ? `/public/courses/${req.file.filename}` : undefined;
    const image = req.file ? req.file.path : null;


    const updatedData = {
      ...req.body,
      updatedBy: req.user?.role || 'admin',
    };

    if (image !== undefined) {
      updatedData.image = image;
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ message: 'Course permanently deleted', data: deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};