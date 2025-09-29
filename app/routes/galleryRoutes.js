// const express = require('express');
// const router = express.Router();
// const galleryController = require('../Controllers/galleryController');
// const createUpload = require('../middlewares/upload');
// const { requireSignIn } = require('../middlewares/authMiddleware');

// // Multer upload middleware
// const uploadGalleryImage = createUpload('gallery');

// // Routes
// router.post(
//   '/',
//   (req, res, next) => {
//     uploadGalleryImage(req, res, err => {
//       if (err) return res.status(400).json({ error: err.message });
//       next();
//     });
//   },
//   requireSignIn,
//   galleryController.createGallery
// );

// router.get('/', galleryController.getAllGallery);
// router.get('/:id', galleryController.getGalleryById);

// router.put(
//   '/:id',
//   (req, res, next) => {
//     uploadGalleryImage(req, res, err => {
//       if (err) return res.status(400).json({ error: err.message });
//       next();
//     });
//   },
//   requireSignIn,
//   galleryController.updateGallery
// );

// router.delete('/:id', requireSignIn, galleryController.deleteGallery);

// module.exports = router;



const express = require('express');
const router = express.Router();
const galleryController = require('../Controllers/galleryController');
const createUpload = require('../middlewares/upload');
const { requireSignIn } = require('../middlewares/authMiddleware');

// Multer upload middleware for single image
const uploadGalleryImage = createUpload('gallery');

// Routes
router.post(
  '/',
  (req, res, next) => {
    uploadGalleryImage(req, res, err => {
      if (err) return res.status(400).json({ error: err.message });
      next();
    });
  },
  requireSignIn,
  galleryController.createGallery
);

router.get('/', galleryController.getAllGallery);
router.get('/:id', galleryController.getGalleryById);

router.put(
  '/:id',
  (req, res, next) => {
    uploadGalleryImage(req, res, err => {
      if (err) return res.status(400).json({ error: err.message });
      next();
    });
  },
  requireSignIn,
  galleryController.updateGallery
);

router.delete('/:id', requireSignIn, galleryController.deleteGallery);

module.exports = router;