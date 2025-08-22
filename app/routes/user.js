const express = require('express');
const router = express.Router();
const userController = require('../Controllers/user');
const { requireSignIn, isAdmin, isSelfOrAdmin } = require('../middlewares/authMiddleware');
const createUpload = require('../middlewares/upload');

// Use multer to upload to /public/users
const upload = createUpload('users');

// ==========================
// 📌 Public Routes
// ==========================
router.post('/register', (req, res, next) => {
  upload(req, res, err => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}, userController.register);

router.post('/login', userController.login);
router.post('/send-otp', userController.sendOTP);
router.post('/verify-otp', userController.verifyOTP);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

// ==========================
// 🔐 Protected Routes
// ==========================

// Get current user
router.get('/current', requireSignIn, userController.current);

// Update current user
router.put('/update', requireSignIn, (req, res, next) => {
  upload(req, res, err => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}, userController.update);

// ==========================
// 🔐 Admin Routes
// ==========================

router.get('/', requireSignIn, isAdmin, userController.getAll);
router.get('/:id', requireSignIn, isAdmin, userController.getById);

router.delete('/:id', requireSignIn, isAdmin, userController.delete);
router.put('/block/:id', requireSignIn, isAdmin, userController.block);
router.put('/reactivate/:id', requireSignIn, isAdmin, userController.reactivate);

module.exports = router;