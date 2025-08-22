const fs = require('fs');
const path = require('path');
const Service = require('../models/service');

// CREATE
exports.createService = async (req, res) => {
  try {
    const { title, shortDesc, fullDesc, points } = req.body;
    if (!req.file) return res.status(400).json({ error: 'Image is required.' });

    const image = `${req.protocol}://${req.get('host')}/public/service/${req.file.filename}`;
    let parsedPoints = [];

    if (points) {
      parsedPoints = JSON.parse(points);
      if (!Array.isArray(parsedPoints)) {
        return res.status(400).json({ error: 'Points must be an array.' });
      }
    }

    const service = new Service({ title, shortDesc, fullDesc, image, points: parsedPoints });
    const saved = await service.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create service' });
  }
};

// GET ALL
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    const total = await Service.countDocuments();
    res.json({ total, data: services });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve services' });
  }
};

// GET BY ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve service' });
  }
};

// UPDATE
exports.updateService = async (req, res) => {
  try {
    const { title, shortDesc, fullDesc, points } = req.body;
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    let parsedPoints;
    if (points) {
      parsedPoints = JSON.parse(points);
      if (!Array.isArray(parsedPoints)) {
        return res.status(400).json({ error: 'Points must be an array.' });
      }
    }

    if (req.file && service.image) {
      const oldImagePath = path.join(__dirname, `../../public/service/${path.basename(service.image)}`);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (shortDesc) updateData.shortDesc = shortDesc;
    if (fullDesc) updateData.fullDesc = fullDesc;
    if (parsedPoints !== undefined) updateData.points = parsedPoints;
    if (req.file) {
      updateData.image = `${req.protocol}://${req.get('host')}/public/service/${req.file.filename}`;
    }

    const updated = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update service' });
  }
};

// DELETE (hard delete)
exports.hardDeleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    if (service.image) {
      const imagePath = path.join(__dirname, `../../public/service/${path.basename(service.image)}`);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service permanently deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
};
