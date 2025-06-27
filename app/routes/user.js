const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/user');
const { requireSignIn, isAdmin, isLicensee, isSelfOrAdmin } = require("../middlewares/authMiddleware");

// const createUpload = require('../middlewares/upload');
const createUpload = require('../middlewares/cloudinaryUpload');

const uploadUsersImage = createUpload.createUpload('users');

/**
 * @route POST /users
 * @desc Create a new user
 * - If userType is 'licensee', only admin can create
 * - Otherwise public
 * @access Public for normal users, Admin for licensee
 */
router.post('/',
  (req, res, next) => {
    uploadUsersImage(req, res, err => {
      if (err) return res.status(400).json({ error: err.message });
      next();
    });
  },
  async (req, res, next) => {
    try {
      const { userType } = req.body;

      if (userType === 'licensee') {
        return requireSignIn(req, res, (err) => {
          if (err) return next(err);

          if (!req.user) {
            return res.status(401).json({
              success: false,
              message: "Authentication required to create licensee users",
            });
          }

          if (req.user.userType !== 'admin') {
            return res.status(403).json({
              success: false,
              message: "Only admins can create licensee users",
            });
          }

          UserController.CreateUserController(req, res, next);
        });
      } else {
        UserController.CreateUserController(req, res, next);
      }
    } catch (error) {
      next(error);
    }
  });

router.post('/create-licensee', requireSignIn, isAdmin, UserController.CreateUserController);

/**
 * @route POST /users/login
 * @desc Authenticate user & get token
 * @access Public
 */
router.post('/login', UserController.loginController);

/**
 * @route POST /users/forgot-password
 * @desc Reset user password
 * @access Public
 */
router.post('/forgot-password', UserController.forgotPasswordController);

/**
 * @route GET /users/current
 * @desc Get current user profile
 * @access Private
 */
router.get('/current', requireSignIn, UserController.currentUserController);

/**
 * @route GET /users/licensee-auth
 * @desc Check licensee authentication
 * @access Private/Licensee
 */
router.get('/licensee-auth', requireSignIn, isLicensee, (req, res) => {
  res.status(200).send({
    success: true,
    message: "Licensee authentication successful"
  });
});

/**
 * @route GET /users/admin-auth
 * @desc Check admin authentication
 * @access Private/Admin
 */
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({
    success: true,
    message: "Admin authentication successful"
  });
});

/**
 * @route GET /users
 * @desc Get all users
 * @access Private/Admin
 */
router.get('/', requireSignIn, isAdmin, UserController.GetAllUsersController);

/**
 * @route GET /users/:id
 * @desc Get user by ID
 * @access Private (Self or Admin)
 */
router.get('/:id', requireSignIn, isSelfOrAdmin, UserController.GetSingleUserController);

/**
 * @route PUT /users/:id
 * @desc Update user
 * @access Private (Self or Admin)
 */
router.put('/:id',
  (req, res, next) => {
    uploadUsersImage(req, res, err => {
      if (err) return res.status(400).json({ error: err.message });
      next();
    });
  },
  requireSignIn, isSelfOrAdmin, UserController.UpdateUserController);

// Soft delete
router.patch('/:id/delete', requireSignIn, isAdmin, UserController.softDelete);

// Reactivate
router.patch('/:id/reactivate', requireSignIn, isAdmin, UserController.reactivateUser);


module.exports = router;