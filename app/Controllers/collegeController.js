// const fs = require('fs');
// const path = require('path');
// const College = require('../models/college');

// // Safely parse JSON fields (e.g. arrays coming as strings from frontend)
// const safeParseJSON = (value, fallback = []) => {
//   try {
//     return value ? JSON.parse(value) : fallback;
//   } catch {
//     return fallback;
//   }
// };

// // CREATE
// exports.createCollege = async (req, res) => {
//   try {
//     const {
//       name, email, phone, address, website, desc, map,
//       category, status, facilities, services, country, state, courses, visible
//     } = req.body;

//     const existingCollege = await College.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
//     if (existingCollege) {
//       return res.status(400).json({ error: 'College name already exists' });
//     }

//     const image = req.file
//       ? `${req.protocol}://${req.get('host')}/public/college/${req.file.filename}`
//       : null;

//     const newCollege = new College({
//       name, email, phone, address, website, desc, map,
//       category: safeParseJSON(category),
//       status, country, state,
//       facilities: safeParseJSON(facilities),
//       services: safeParseJSON(services),
//       courses: safeParseJSON(courses),
//       image,
//       visible: visible !== undefined ? JSON.parse(visible) : true
//     });

//     const saved = await newCollege.save();
//     const populated = await saved.populate('country state courses');
//     res.status(201).json(populated);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // READ ALL
// exports.getColleges = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search, category, status, country, state } = req.query;
//     const filter = {};

//     if (search) {
//       filter.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { desc: { $regex: search, $options: 'i' } }
//       ];
//     }

//     if (category) filter.category = { $in: safeParseJSON(category) };
//     if (status) filter.status = status;
//     if (country) filter.country = country;
//     if (state) filter.state = state;

//     const colleges = await College.find(filter)
//       .populate('country state courses')
//       .limit(Number(limit))
//       .skip((page - 1) * limit)
//       .sort({ createdAt: -1 });

//     const total = await College.countDocuments(filter);

//     res.json({
//       colleges,
//       totalPages: Math.ceil(total / limit),
//       currentPage: Number(page),
//       total
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // READ SINGLE
// exports.getCollegeById = async (req, res) => {
//   try {
//     const college = await College.findById(req.params.id)
//       .populate('country state courses');

//     if (!college) return res.status(404).json({ error: 'College not found' });
//     res.json(college);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // UPDATE
// exports.updateCollege = async (req, res) => {
//   try {
//     const {
//       name, email, phone, address, website, desc, map,
//       category, status, facilities, services, country, state, courses, visible
//     } = req.body;

//     const college = await College.findById(req.params.id);
//     if (!college) return res.status(404).json({ error: 'College not found' });

//     // 🔍 check duplicate name (ignore current college)
//     if (name && name.toLowerCase() !== college.name.toLowerCase()) {
//       const existingCollege = await College.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
//       if (existingCollege) {
//         return res.status(400).json({ error: 'College name already exists' });
//       }
//     }

//     if (req.file && college.image) {
//       const oldImagePath = path.join(__dirname, `../../public/college/${path.basename(college.image)}`);
//       if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
//     }

//     const image = req.file
//       ? `${req.protocol}://${req.get('host')}/public/college/${req.file.filename}`
//       : college.image;

//     const updateData = {
//       name, email, phone, address, website, desc, map,
//       category: safeParseJSON(category),
//       status, country, state,
//       image,
//       visible: visible !== undefined ? JSON.parse(visible) : college.visible,
//       facilities: safeParseJSON(facilities),
//       services: safeParseJSON(services),
//       courses: safeParseJSON(courses)
//     };

//     const updated = await College.findByIdAndUpdate(req.params.id, updateData, { new: true })
//       .populate('country state courses');

//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // DELETE
// exports.deleteCollege = async (req, res) => {
//   try {
//     const college = await College.findById(req.params.id);
//     if (!college) return res.status(404).json({ error: 'College not found' });

//     if (college.image) {
//       const imagePath = path.join(__dirname, `../../public/college/${path.basename(college.image)}`);
//       if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
//     }

//     await College.findByIdAndDelete(req.params.id);
//     res.json({ message: 'College permanently deleted' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // COUNT
// exports.getCollegeCount = async (req, res) => {
//   try {
//     const count = await College.countDocuments();
//     res.json({ count });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };






const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const College = require('../models/college');

// Enhanced safeParseJSON with type checking and logging
const safeParseJSON = (value, fieldName, fallback = []) => {
  if (!value) {
    console.warn(`Field ${fieldName} is empty or undefined, using fallback:`, fallback);
    return fallback;
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (!Array.isArray(parsed)) {
        console.warn(`Field ${fieldName} parsed as non-array:`, parsed);
        return fallback;
      }
      return parsed;
    } catch (err) {
      console.error(`Error parsing ${fieldName}:`, err.message, 'Input:', value);
      return fallback;
    }
  }

  console.warn(`Field ${fieldName} is neither string nor array:`, value);
  return fallback;
};

// CREATE
exports.createCollege = async (req, res) => {
  try {
    const {
      name, email, phone, address, website, desc, map,
      category, status, country, state, courses, facilities, services, visible
    } = req.body;

    // console.log('Create college payload:', req.body); // Debug input

    // Validate required fields
    if (!name || !email || !country) {
      return res.status(400).json({ error: 'Name, email, and country are required' });
    }

    // Validate category
    const validCategories = ['Graduate', 'Postgraduate', 'Diploma', 'PhD'];
    const parsedCategory = safeParseJSON(category, 'category');
    if (parsedCategory.length > 0 && !parsedCategory.every(cat => validCategories.includes(cat))) {
      return res.status(400).json({ error: 'Invalid category values' });
    }

    // Validate courses
    const parsedCourses = safeParseJSON(courses, 'courses');
    if (parsedCourses.length > 0 && !parsedCourses.every(id => mongoose.isValidObjectId(id))) {
      return res.status(400).json({ error: 'Invalid course IDs' });
    }

    // Validate facilities
    const parsedFacilities = safeParseJSON(facilities, 'facilities');
    if (parsedFacilities.length > 0 && !parsedFacilities.every(f => typeof f === 'string')) {
      return res.status(400).json({ error: 'Invalid facilities values' });
    }

    // Validate services
    const parsedServices = safeParseJSON(services, 'services');
    if (parsedServices.length > 0 && !parsedServices.every(s => typeof s === 'string')) {
      return res.status(400).json({ error: 'Invalid services values' });
    }

    const existingCollege = await College.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
    if (existingCollege) {
      return res.status(400).json({ error: 'College name already exists' });
    }

    const image = req.file
      ? `${req.protocol}://${req.get('host')}/public/college/${req.file.filename}`
      : null;

    const newCollege = new College({
      name, email, phone, address, website, desc, map,
      category: parsedCategory,
      status: status || 'new',
      country,
      state,
      courses: parsedCourses,
      facilities: parsedFacilities,
      services: parsedServices,
      image,
      visible: visible !== undefined ? JSON.parse(visible) : true
    });

    const saved = await newCollege.save();
    const populated = await saved.populate('country state courses');
    // console.log('Created college:', populated); // Debug output
    res.status(201).json(populated);
  } catch (err) {
    console.error('Create college error:', err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateCollege = async (req, res) => {
  try {
    const {
      name, email, phone, address, website, desc, map,
      category, status, country, state, courses, facilities, services, visible
    } = req.body;

    console.log('Update college payload:', req.body); // Debug input

    const college = await College.findById(req.params.id);
    if (!college) return res.status(404).json({ error: 'College not found' });

    // Check duplicate name
    if (name && name.toLowerCase() !== college.name.toLowerCase()) {
      const existingCollege = await College.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
      if (existingCollege) {
        return res.status(400).json({ error: 'College name already exists' });
      }
    }

    // Validate category
    const validCategories = ['Graduate', 'Postgraduate', 'Diploma', 'PhD'];
    const parsedCategory = safeParseJSON(category, 'category');
    if (parsedCategory.length > 0 && !parsedCategory.every(cat => validCategories.includes(cat))) {
      return res.status(400).json({ error: 'Invalid category values' });
    }

    // Validate courses
    const parsedCourses = safeParseJSON(courses, 'courses');
    if (parsedCourses.length > 0 && !parsedCourses.every(id => mongoose.isValidObjectId(id))) {
      return res.status(400).json({ error: 'Invalid course IDs' });
    }

    // Validate facilities
    const parsedFacilities = safeParseJSON(facilities, 'facilities');
    if (parsedFacilities.length > 0 && !parsedFacilities.every(f => typeof f === 'string')) {
      return res.status(400).json({ error: 'Invalid facilities values' });
    }

    // Validate services
    const parsedServices = safeParseJSON(services, 'services');
    if (parsedServices.length > 0 && !parsedServices.every(s => typeof s === 'string')) {
      return res.status(400).json({ error: 'Invalid services values' });
    }

    if (req.file && college.image) {
      const oldImagePath = path.join(__dirname, `../../public/college/${path.basename(college.image)}`);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    const image = req.file
      ? `${req.protocol}://${req.get('host')}/public/college/${req.file.filename}`
      : college.image;

    const updateData = {
      name: name || college.name,
      email: email || college.email,
      phone: phone || college.phone,
      address: address || college.address,
      website: website || college.website,
      desc: desc || college.desc,
      map: map || college.map,
      category: parsedCategory.length > 0 ? parsedCategory : college.category,
      status: status || college.status,
      country: country || college.country,
      state: state || college.state,
      courses: parsedCourses.length > 0 ? parsedCourses : college.courses,
      facilities: parsedFacilities, // Always use parsedFacilities (empty array if input is empty)
      services: parsedServices, // Always use parsedServices (empty array if input is empty)
      image,
      visible: visible !== undefined ? JSON.parse(visible) : college.visible
    };

    const updated = await College.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate('country state courses');

    // console.log('Updated college:', updated); // Debug output
    res.json(updated);
  } catch (err) {
    console.error('Update college error:', err);
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
        { desc: { $regex: search, $options: 'i' } },
        { facilities: { $regex: search, $options: 'i' } },
        { services: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      const parsedCategory = safeParseJSON(category, 'category');
      if (parsedCategory.length > 0) filter.category = { $in: parsedCategory };
    }
    if (status) filter.status = status;
    if (country) filter.country = country;
    if (state) filter.state = state;

    const colleges = await College.find(filter)
      .populate('country state courses')
      .limit(Number(limit))
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await College.countDocuments(filter);

    // console.log('Fetched colleges:', colleges); // Debug output
    res.json({
      colleges,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total
    });
  } catch (err) {
    console.error('Get colleges error:', err);
    res.status(500).json({ error: err.message });
  }
};

// READ SINGLE
exports.getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id)
      .populate('country state courses');

    if (!college) return res.status(404).json({ error: 'College not found' });
    console.log('Fetched college by ID:', college); // Debug output
    res.json(college);
  } catch (err) {
    console.error('Get college by ID error:', err);
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
    console.error('Delete college error:', err);
    res.status(500).json({ error: err.message });
  }
};

// COUNT
exports.getCollegeCount = async (req, res) => {
  try {
    const count = await College.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error('Get college count error:', err);
    res.status(500).json({ error: err.message });
  }
};