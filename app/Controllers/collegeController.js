const fs = require('fs');
const path = require('path');
const College = require('../models/college');

// Safely parse JSON fields (e.g. arrays coming as strings from frontend)
const safeParseJSON = (value, fallback = []) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

// CREATE
exports.createCollege = async (req, res) => {
  try {
    const {
      name, email, phone, address, website, desc, map,
      category, status, facilities, services, country, state, courses, visible
    } = req.body;

    const existingCollege = await College.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
    if (existingCollege) {
      return res.status(400).json({ error: 'College name already exists' });
    }

    const image = req.file
      ? `${req.protocol}://${req.get('host')}/public/college/${req.file.filename}`
      : null;

    const newCollege = new College({
      name, email, phone, address, website, desc, map,
      category: safeParseJSON(category),
      status, country, state,
      facilities: safeParseJSON(facilities),
      services: safeParseJSON(services),
      courses: safeParseJSON(courses),
      image,
      visible: visible !== undefined ? JSON.parse(visible) : true
    });

    const saved = await newCollege.save();
    const populated = await saved.populate('country state courses');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ALL
exports.getColleges = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, status, country, state } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { desc: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) filter.category = { $in: safeParseJSON(category) };
    if (status) filter.status = status;
    if (country) filter.country = country;
    if (state) filter.state = state;

    const colleges = await College.find(filter)
      .populate('country state courses')
      .limit(Number(limit))
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await College.countDocuments(filter);

    res.json({
      colleges,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ SINGLE
exports.getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id)
      .populate('country state courses');

    if (!college) return res.status(404).json({ error: 'College not found' });
    res.json(college);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateCollege = async (req, res) => {
  try {
    const {
      name, email, phone, address, website, desc, map,
      category, status, facilities, services, country, state, courses, visible
    } = req.body;

    const college = await College.findById(req.params.id);
    if (!college) return res.status(404).json({ error: 'College not found' });

    // 🔍 check duplicate name (ignore current college)
    if (name && name.toLowerCase() !== college.name.toLowerCase()) {
      const existingCollege = await College.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
      if (existingCollege) {
        return res.status(400).json({ error: 'College name already exists' });
      }
    }

    if (req.file && college.image) {
      const oldImagePath = path.join(__dirname, `../../public/college/${path.basename(college.image)}`);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    const image = req.file
      ? `${req.protocol}://${req.get('host')}/public/college/${req.file.filename}`
      : college.image;

    const updateData = {
      name, email, phone, address, website, desc, map,
      category: safeParseJSON(category),
      status, country, state,
      image,
      visible: visible !== undefined ? JSON.parse(visible) : college.visible,
      facilities: safeParseJSON(facilities),
      services: safeParseJSON(services),
      courses: safeParseJSON(courses)
    };

    const updated = await College.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate('country state courses');

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.deleteCollege = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) return res.status(404).json({ error: 'College not found' });

    if (college.image) {
      const imagePath = path.join(__dirname, `../../public/college/${path.basename(college.image)}`);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await College.findByIdAndDelete(req.params.id);
    res.json({ message: 'College permanently deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// COUNT
exports.getCollegeCount = async (req, res) => {
  try {
    const count = await College.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
