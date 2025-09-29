const fs = require('fs');
const path = require('path');
const Country = require('../models/country');

// CREATE
exports.createCountry = async (req, res) => {
  try {
    const { name, code, isoCode, dialCode, currency, isDomestic, isDefault } = req.body;

    if (!req.file) return res.status(400).json({ error: 'Image is required.' });

    const image = `${req.protocol}://${req.get('host')}/public/country/${req.file.filename}`;

    const newCountry = new Country({
      name,
      code,
      isoCode,
      dialCode,
      currency,
      image,
      isDomestic: isDomestic || false,
      isDefault: isDefault || false
    });

    const saved = await newCountry.save();
    res.status(201).json({ message: 'Country created successfully', data: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL
exports.getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find().sort({ createdAt: -1 });
    const total = await Country.countDocuments();
    res.json({ total, data: countries });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ONE
exports.getCountryById = async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);
    if (!country) return res.status(404).json({ error: 'Country not found' });
    res.json({ data: country });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateCountry = async (req, res) => {
  try {
    const { name, code, isoCode, dialCode, currency, isDomestic, isDefault } = req.body;

    const country = await Country.findById(req.params.id);
    if (!country) return res.status(404).json({ error: 'Country not found' });

    if (req.file && country.image) {
      const oldPath = path.join(__dirname, `../../public/country/${path.basename(country.image)}`);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const updatedFields = {
      name, code, isoCode, dialCode, currency,
      isDomestic: isDomestic !== undefined ? isDomestic : country.isDomestic,
      isDefault: isDefault !== undefined ? isDefault : country.isDefault
    };

    if (req.file) {
      updatedFields.image = `${req.protocol}://${req.get('host')}/public/country/${req.file.filename}`;
    }

    const updated = await Country.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
    res.json({ message: 'Country updated', data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.deleteCountry = async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);
    if (!country) return res.status(404).json({ error: 'Country not found' });

    if (country.image) {
      const imagePath = path.join(__dirname, `../../public/country/${path.basename(country.image)}`);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await Country.findByIdAndDelete(req.params.id);
    res.json({ message: 'Country permanently deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// COUNT
exports.getCountryCount = async (req, res) => {
  try {
    const count = await Country.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
