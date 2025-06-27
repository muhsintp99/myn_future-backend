const Service = require('../models/service');

// Create a new service
exports.createService = async (req, res) => {
  try {
    const { title, shortDesc, fullDesc, points, createdBy, updatedBy } = req.body;
    // const image = req.file ? `/public/service/${req.file.filename}` : null;
    const image = req.file ? req.file.path : null;

    if (!title || !shortDesc || !fullDesc) {
      return res.status(400).json({ error: 'Title, short description, and full description are required.' });
    }

    if (!image) return res.status(400).json({ error: 'Image is required.' });
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Only image files (jpeg, jpg, png, gif) are allowed.' });
    }

    let parsedPoints = [];
    if (points) {
      parsedPoints = JSON.parse(points);
      if (!Array.isArray(parsedPoints)) {
        return res.status(400).json({ error: 'Points must be an array.' });
      }
    }
    const service = new Service({ 
      title, 
      shortDesc, 
      fullDesc, 
      image, 
      createdBy: createdBy || 'admin',
      updatedBy: updatedBy || 'admin',
      points: parsedPoints
    });
    const saved = await service.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err); // Add logging
    res.status(500).json({ error: 'Failed to create service' });
  }
};

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isDeleted: false }).sort({ createdAt: -1 });
    const total = await Service.countDocuments({ isDeleted: false });

    res.json({ total, data: services });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve services' });
  }
};

// Get a single service
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findOne({ _id: req.params.id, isDeleted: false });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve service' });
  }
};

// Update service
exports.updateService = async (req, res) => {
  try {
    const { title, shortDesc, fullDesc, updatedBy, points } = req.body; // Removed link
    // const image = req.file ? `/public/service/${req.file.filename}` : undefined;
    const image = req.file ? req.file.path : undefined;

    if (image && !['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Only image files (jpeg, jpg, png, gif) are allowed.' });
    }

    let parsedPoints;
    if (points) {
      parsedPoints = JSON.parse(points);
      if (!Array.isArray(parsedPoints)) {
        return res.status(400).json({ error: 'Points must be an array.' });
      }
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (shortDesc) updateData.shortDesc = shortDesc;
    if (fullDesc) updateData.fullDesc = fullDesc;
    if (updatedBy) updateData.updatedBy = updatedBy;
    if (image) updateData.image = image;
    if (parsedPoints !== undefined) updateData.points = parsedPoints;

    const updated = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Service not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update service' });
  }
};

// Soft delete service
exports.softDeleteService = async (req, res) => {
  try {
    const id = req.params.id;
    const service = await Service.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service soft deleted successfully', service });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to soft delete service' });
  }
};

// Hard delete service
exports.hardDeleteService = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedService = await Service.findByIdAndDelete(id);
    if (!deletedService) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service permanently deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete service' });
  }
};

// Get total count of services
exports.totalServiceCount = async (req, res) => {
  try {
    const count = await Service.countDocuments({ isDeleted: false });
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve service count' });
  }
};