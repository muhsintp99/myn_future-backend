const express = require('express');
const router = express.Router();
const { createUpload } = require('../middlewares/cloudinaryUpload');

const upload = createUpload('test-folder');

router.post('/upload', (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    res.json({
      success: true,
      message: "Image uploaded successfully",
      url: req.file.path,
      public_id: req.file.filename
    });
  });
});

module.exports = router;
