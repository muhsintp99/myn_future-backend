const State = require('../models/state');
const Country = require('../models/country');

// Create State
exports.createState = async (req, res) => {
  try {
    const { name, desc, country, isActive, recommend } = req.body;

    // Validate country
    const countryExists = await Country.findById(country);
    if (!countryExists) {
      return res.status(404).json({ success: false, message: 'Country not found' });
    }

    const state = new State({
      name,
      desc,
      country,
      isActive: isActive !== undefined ? isActive : true,
      recommend: recommend !== undefined ? recommend : false
    });

    const saved = await state.save();

    // Populate country after save
    const populated = await saved.populate('country', 'name code');

    res.status(201).json({
      success: true,
      message: 'State created successfully!',
      data: populated
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get All States
exports.getAllStates = async (req, res) => {
  try {
    const states = await State.find()
      .populate('country', 'name code')
      .sort({ createdAt: -1 });

    const total = await State.countDocuments();

    res.json({ success: true, total, data: states });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get State by ID
exports.getStateById = async (req, res) => {
  try {
    const state = await State.findById(req.params.id)
      .populate('country', 'name code');

    if (!state) {
      return res.status(404).json({ success: false, message: 'State not found' });
    }

    res.json({ success: true, data: state });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update State
exports.updateState = async (req, res) => {
  try {
    const { name, desc, country, isActive, recommend } = req.body;

    const updated = await State.findByIdAndUpdate(
      req.params.id,
      {
        name,
        desc,
        country,
        isActive,
        recommend
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'State not found' });
    }

    // Populate country after update
    const populated = await updated.populate('country', 'name code');

    res.json({
      success: true,
      message: 'State updated successfully!',
      data: populated
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete State (Hard Delete)
exports.deleteState = async (req, res) => {
  try {
    const deleted = await State.findByIdAndDelete(req.params.id)
      .populate('country', 'name code');

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'State not found' });
    }

    res.json({
      success: true,
      message: 'State deleted successfully!',
      data: deleted
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Total State Count
exports.getStateCount = async (req, res) => {
  try {
    const count = await State.countDocuments();
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
