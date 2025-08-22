const fs = require('fs');
const path = require('path');
const Gallery = require('../models/gallery');

// CREATE
exports.createGallery = async (req, res) => {
  try {
    const { title, from, link, date } = req.body;
    const image = req.file
      ? `${req.protocol}://${req.get('host')}/public/gallery/${req.file.filename}`
      : null;

    if (!image) return res.status(400).json({ error: "Image is required." });

    const item = new Gallery({
      image,
      title,
      from,
      date: date ? new Date(date) : new Date(),
      link
    });

    const saved = await item.save();
    res.status(201).json({ data: saved });
  } catch (error) {
    res.status(500).json({ error: error.message || "Error creating gallery item" });
  }
};

// GET ALL
exports.getAllGallery = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    const total = await Gallery.countDocuments();
    res.json({ data: items, total });
  } catch (error) {
    res.status(500).json({ error: error.message || "Error retrieving gallery" });
  }
};

// GET BY ID
exports.getGalleryById = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Gallery item not found" });
    res.json({ data: item });
  } catch (error) {
    res.status(500).json({ error: error.message || "Error fetching gallery item" });
  }
};

// UPDATE
exports.updateGallery = async (req, res) => {
  try {
    const { title, from, link } = req.body;
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ error: "Gallery item not found" });

    if (req.file && gallery.image) {
      const oldImagePath = path.join(__dirname, `../../public/gallery/${path.basename(gallery.image)}`);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    const updateData = { title, from, link };
    if (req.file) {
      updateData.image = `${req.protocol}://${req.get('host')}/public/gallery/${req.file.filename}`;
    }

    const updatedItem = await Gallery.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ data: updatedItem });
  } catch (error) {
    res.status(500).json({ error: error.message || "Error updating gallery item" });
  }
};

// HARD DELETE
exports.deleteGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) return res.status(404).json({ error: "Gallery item not found" });

    if (gallery.image) {
      const imagePath = path.join(__dirname, `../../public/gallery/${path.basename(gallery.image)}`);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: "Gallery item permanently deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Error deleting gallery item" });
  }
};
