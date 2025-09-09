const Service = require('../models/service');

// CREATE
exports.createService = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required.' });
    }

    const service = new Service({ title });
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
    const services = await Service.find({ isDeleted: false }).sort({ createdAt: -1 });
    const total = await Service.countDocuments({ isDeleted: false });
    res.json({ total, data: services });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve services' });
  }
};

// GET BY ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service || service.isDeleted) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve service' });
  }
};

// UPDATE
exports.updateService = async (req, res) => {
  try {
    const { title } = req.body;
    const service = await Service.findById(req.params.id);
    if (!service || service.isDeleted) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (title) service.title = title;
    service.updatedBy = "admin";
    await service.save();

    res.json(service);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update service' });
  }
};

// DELETE (hard delete)
exports.hardDeleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service permanently deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
};
