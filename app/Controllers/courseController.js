const Course = require('../models/course');
const fs = require('fs');
const path = require('path');

// Create new course
exports.createCourse = async (req, res) => {
  try {
    const image = req.file
      ? `${req.protocol}://${req.get('host')}/public/courses/${req.file.filename}`
      : null;

    const courseData = {
      ...req.body,
      image,
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
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Delete old image if new one uploaded
    if (req.file && course.image) {
      const oldPath = path.join(__dirname, `../../public/courses/${path.basename(course.image)}`);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const image = req.file
      ? `${req.protocol}://${req.get('host')}/public/courses/${req.file.filename}`
      : course.image;

    const updatedData = {
      ...req.body,
      image,
    };

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Delete image from folder if exists
    if (course.image && fs.existsSync(course.image)) {
      deleteImage(course.image);
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({ message: 'Course permanently deleted', data: course });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
