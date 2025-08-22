const express = require('express');
const router = express.Router();
const blogController = require('../Controllers/blogController');
const createUpload = require('../middlewares/upload');
const { requireSignIn, isAdminOrLicensee } = require('../middlewares/authMiddleware');

const uploadBlogImage = createUpload('blog');

// Create blog with image
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

// Get all blogs
router.get('/', blogController.getAllBlog);

// Get one blog
router.get('/:id', blogController.getBlogById);

// Update blog
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

// Hard delete blog
router.delete('/:id', requireSignIn, isAdminOrLicensee, blogController.deleteBlog);

module.exports = router;