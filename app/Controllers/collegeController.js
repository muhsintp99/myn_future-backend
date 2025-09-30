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

const safeParseJSON = (value, fieldName, fallback = []) => {
  if (!value) {
    console.warn(`Field ${fieldName} is empty or undefined, using fallback:`, fallback);
    return fallback;
  }

  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      console.warn(`Field ${fieldName} parsed to non-array:`, parsed);
      return fallback;
    }
    return parsed;
  } catch (err) {
    console.error(`Failed to parse ${fieldName}:`, err);
    return fallback;
  }
};

exports.createCollege = async (req, res) => {
  try {
    const {
      name, email, phone, address, website, desc, map,
      category, status, facilities, services, country, state, courses, visible
    } = req.body;

    console.log('Create college payload:', req.body);

    const existingCollege = await College.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
    if (existingCollege) {
      return res.status(400).json({ error: 'College name already exists' });
    }

    const validCategories = ['Graduate', 'Postgraduate', 'Diploma', 'PhD'];
    const parsedCategory = safeParseJSON(category, 'category');
    if (parsedCategory.length > 0 && !parsedCategory.every(cat => validCategories.includes(cat))) {
      return res.status(400).json({ error: 'Invalid category values' });
    }

    const parsedCourses = safeParseJSON(courses, 'courses');
    if (parsedCourses.length > 0 && !parsedCourses.every(id => mongoose.isValidObjectId(id))) {
      return res.status(400).json({ error: 'Invalid course IDs' });
    }

    const parsedFacilities = safeParseJSON(facilities, 'facilities');
    if (parsedFacilities.length > 0 && !parsedFacilities.every(f => typeof f === 'string')) {
      return res.status(400).json({ error: 'Invalid facilities values' });
    }

    const parsedServices = safeParseJSON(services, 'services');
    if (parsedServices.length > 0 && !parsedServices.every(s => typeof s === 'string')) {
      return res.status(400).json({ error: 'Invalid services values' });
    }

    const image = req.file
      ? `${req.protocol}://${req.get('host')}/public/college/${req.file.filename}`
      : null;

    const newCollege = new College({
      name, email, phone, address, website, desc, map,
      category: parsedCategory,
      status, country, state,
      facilities: parsedFacilities,
      services: parsedServices,
      courses: parsedCourses,
      image,
      visible: visible !== undefined ? JSON.parse(visible) : true
    });

    const saved = await newCollege.save();
    const populated = await saved.populate('country state courses');
    console.log('Created college:', populated);
    res.status(201).json(populated);
  } catch (err) {
    console.error('Create college error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getColleges = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, status, country, state } = req.query;

    const matchFilter = {};
    if (status) matchFilter.status = status;
    if (country) matchFilter.country = new mongoose.Types.ObjectId(country);
    if (state) matchFilter.state = new mongoose.Types.ObjectId(state);
    if (category) {
      const parsedCategory = safeParseJSON(category, 'category');
      if (parsedCategory.length > 0) matchFilter.category = { $in: parsedCategory };
    }

    let searchMatch = null;
    if (search) {
      searchMatch = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { desc: { $regex: search, $options: 'i' } },
          { facilities: { $regex: search, $options: 'i' } },
          { services: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { 'coursesData.title': { $regex: search, $options: 'i' } }
        ]
      };
    }

    const pipeline = [];

    if (Object.keys(matchFilter).length > 0) {
      pipeline.push({ $match: matchFilter });
    }

    pipeline.push({
      $lookup: {
        from: 'courses',
        localField: 'courses',
        foreignField: '_id',
        as: 'coursesData'
      }
    });

    if (searchMatch) {
      pipeline.push({ $match: searchMatch });
    }

    pipeline.push({
      $lookup: {
        from: 'countries',
        localField: 'country',
        foreignField: '_id',
        as: 'country'
      }
    });
    pipeline.push({ $unwind: { path: '$country', preserveNullAndEmptyArrays: true } });

    pipeline.push({
      $lookup: {
        from: 'states',
        localField: 'state',
        foreignField: '_id',
        as: 'state'
      }
    });
    pipeline.push({ $unwind: { path: '$state', preserveNullAndEmptyArrays: true } });

    pipeline.push({ $sort: { createdAt: -1 } });
    pipeline.push({ $skip: (page - 1) * limit });
    pipeline.push({ $limit: Number(limit) });

    let colleges = await College.aggregate(pipeline);

    colleges = colleges.map(c => {
      c.courses = c.coursesData || [];
      delete c.coursesData;
      return c;
    });

    const countPipeline = [];
    if (Object.keys(matchFilter).length > 0) {
      countPipeline.push({ $match: matchFilter });
    }

    countPipeline.push({
      $lookup: {
        from: 'courses',
        localField: 'courses',
        foreignField: '_id',
        as: 'coursesData'
      }
    });

    if (searchMatch) {
      countPipeline.push({ $match: searchMatch });
    }

    countPipeline.push({ $count: 'total' });

    const countResult = await College.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;

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

exports.getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id)
      .populate('country state courses');

    if (!college) return res.status(404).json({ error: 'College not found' });
    console.log('Fetched college by ID:', college);
    res.json(college);
  } catch (err) {
    console.error('Get college by ID error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateCollege = async (req, res) => {
  try {
    const {
      name, email, phone, address, website, desc, map,
      category, status, facilities, services, country, state, courses, visible
    } = req.body;

    console.log('Update college payload:', req.body);

    const college = await College.findById(req.params.id);
    if (!college) return res.status(404).json({ error: 'College not found' });

    if (name && name.toLowerCase() !== college.name.toLowerCase()) {
      const existingCollege = await College.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
      if (existingCollege) {
        return res.status(400).json({ error: 'College name already exists' });
      }
    }

    const validCategories = ['Graduate', 'Postgraduate', 'Diploma', 'PhD'];
    const parsedCategory = safeParseJSON(category, 'category');
    if (parsedCategory.length > 0 && !parsedCategory.every(cat => validCategories.includes(cat))) {
      return res.status(400).json({ error: 'Invalid category values' });
    }

    const parsedCourses = safeParseJSON(courses, 'courses');
    if (parsedCourses.length > 0 && !parsedCourses.every(id => mongoose.isValidObjectId(id))) {
      return res.status(400).json({ error: 'Invalid course IDs' });
    }

    const parsedFacilities = safeParseJSON(facilities, 'facilities');
    if (parsedFacilities.length > 0 && !parsedFacilities.every(f => typeof f === 'string')) {
      return res.status(400).json({ error: 'Invalid facilities values' });
    }

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
      facilities: parsedFacilities,
      services: parsedServices,
      image,
      visible: visible !== undefined ? JSON.parse(visible) : college.visible
    };

    const updated = await College.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate('country state courses');

    console.log('Updated college:', updated);
    res.json(updated);
  } catch (err) {
    console.error('Update college error:', err);
    res.status(500).json({ error: err.message });
  }
};

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

exports.getCollegeCount = async (req, res) => {
  try {
    const count = await College.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error('Get college count error:', err);
    res.status(500).json({ error: err.message });
  }
};