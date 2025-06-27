const express = require('express');
const router = express.Router();
const blogController = require('../Controllers/blogController');
// const createUpload = require('../middlewares/upload');
const createUpload = require('../middlewares/cloudinaryUpload');
const { requireSignIn, isAdminOrLicensee } = require('../middlewares/authMiddleware');

const uploadBlogImage = createUpload.createUpload('blog');

// Create blog with image - only Admin or Licensee
router.post(
  '/',
  requireSignIn,
  isAdminOrLicensee,
  (req, res, next) => {
    uploadBlogImage(req, res, err => {
      if (err) return res.status(400).json({ error: err.message });
      next();
    });
  },
  blogController.createBlog
);

// Get all blogs - public (or protect if needed)
router.get('/', blogController.getAllBlog);

// Get one blog - public (or protect if needed)
router.get('/:id', blogController.getBlogById);

// Update blog with image - only Admin or Licensee
router.put(
  '/:id',
  requireSignIn,
  isAdminOrLicensee,
  (req, res, next) => {
    uploadBlogImage(req, res, err => {
      if (err) return res.status(400).json({ error: err.message });
      next();
    });
  },
  blogController.updateBlog
);

// Soft delete blog - only Admin or Licensee
router.patch('/:id', requireSignIn, isAdminOrLicensee, blogController.softDeleteBlog);

// Hard delete blog - only Admin or Licensee
router.delete('/:id', requireSignIn, isAdminOrLicensee, blogController.deleteBlog);

module.exports = router;