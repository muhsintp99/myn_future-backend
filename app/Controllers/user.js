const User = require("../models/user");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const JWT = require('jsonwebtoken');

// Create User
exports.CreateUserController = async (req, res) => {
  try {
    const { fname, lname, email, mobile, password, userType } = req.body;
    // const image = req.file ? `/public/users/${req.file.filename}` : null;
    const image = req.file ? req.file.path : null;


    // Input validation
    if (!fname) {
      return res.status(400).send({ success: false, message: "FirstName is Required" });
    }
    if (!lname) {
      return res.status(400).send({ success: false, message: "LastName is Required" });
    }
    if (!email) {
      return res.status(400).send({ success: false, message: "Email is Required" });
    }
    if (!mobile) {
      return res.status(400).send({ success: false, message: "Mobile is Required" });
    }
    if (!password) {
      return res.status(400).send({ success: false, message: "Password is Required" });
    }
    if (!userType) {
      return res.status(400).send({ success: false, message: "User Type is Required" });
    }

    // Additional check for licensee creation
    if (userType === 'licensee') {
      // Check if request is coming from authenticated admin
      if (!req.user || req.user.userType !== 'admin') {
        return res.status(403).send({
          success: false,
          message: "Only admins can create licensee users"
        });
      }
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "User with this email already exists"
      });
    }

    // Check for existing mobile number
    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
      return res.status(409).send({
        success: false,
        message: "User with this mobile number already exists"
      });
    }

    // Register user
    const hashedPassword = await hashPassword(password);

    const user = await new User({
      fname,
      lname,
      email,
      mobile,
      password: hashedPassword,
      userType,
      image,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: req.user ? req.user._id : 'system',
      updatedBy: req.user ? req.user._id : 'system',
      isDeleted: false
    }).save();

    // Don't return password in response
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).send({
      success: true,
      message: `Successfully created ${userType} user`,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating a user",
      error: error.message
    });
  }
};

// LOGIN USER
exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: 'Email is not registered'
      });
    }

    if (user.isDeleted) {
      return res.status(403).send({
        success: false,
        message: 'Account is deactivated'
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: 'Invalid Password'
      });
    }

    await User.findByIdAndUpdate(user._id, {
      lastLogin: new Date(),
      ftLogin: false
    });

    const token = JWT.sign(
      {
        _id: user._id,
        userType: user.userType,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).send({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        fname: user.fname,
        lname: user.lname,
        mobile: user.mobile,
        image: user.image,
        email: user.email,
        userType: user.userType,
        status: user.status
      },
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in login',
      error: error.message
    });
  }
};





// FORGOT PASSWORD
exports.forgotPasswordController = async (req, res) => {
  try {
    const { email, mobile, newPassword } = req.body;

    // Validation
    if (!email) {
      return res.status(400).send({ success: false, message: "Email is Required" });
    }
    if (!mobile) {
      return res.status(400).send({ success: false, message: "Mobile number is Required" });
    }
    if (!newPassword) {
      return res.status(400).send({ success: false, message: "New Password is Required" });
    }

    // Check user
    const user = await User.findOne({ email, mobile });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found with provided email and mobile number"
      });
    }

    // Check if user is deleted
    if (user.isDeleted) {
      return res.status(403).send({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Update password
    const hashed = await hashPassword(newPassword);
    await User.findByIdAndUpdate(user._id, {
      password: hashed,
      updatedAt: new Date().toISOString(),
      updatedBy: 'self'
    });

    res.status(200).send({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in password reset",
      error: error.message
    });
  }
};

// CURRENT USER
exports.currentUserController = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized access"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found"
      });
    }

    if (user.isDeleted) {
      return res.status(403).send({
        success: false,
        message: 'Account is deactivated'
      });
    }

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(200).send({
      success: true,
      message: "Current user details",
      user: userWithoutPassword
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching current user",
      error: error.message
    });
  }
};

// UPDATE USER
exports.UpdateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    // const image = req.file ? `/public/users/${req.file.filename}` : null; // Use correct path
    const image = req.file ? req.file.path : null;
    const updatedData = { ...req.body };

    // Prevent sensitive fields from being updated
    delete updatedData.password;
    delete updatedData.userType;

    if (image) {
      updatedData.image = image;
    }

    updatedData.updatedAt = new Date();
    updatedData.updatedBy = req.user?._id || 'system';

    // Find the user first
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent updates to deleted users
    if (user.isDeleted) {
      return res.status(403).json({
        success: false,
        message: 'Cannot update deactivated account',
      });
    }

    // Perform the update
    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: 'Successfully updated the user',
      user: userResponse,
    });
  } catch (error) {
    console.error('Update User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in updating the user',
      error: error.message,
    });
  }
};


// Get all users (both deleted and active)
exports.GetAllUsersController = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "All users retrieved successfully",
      count: users.length,
      users
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting all users",
      error: error.message
    });
  }
};

// Get Single User by ID
exports.GetSingleUserController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({
        success: false,
        message: "User ID is required"
      });
    }

    const user = await User.findById(id).select('-password');

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found"
      });
    }

    // Authorization is handled by isSelfOrAdmin middleware

    res.status(200).send({
      success: true,
      message: "User retrieved successfully",
      user
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting user details",
      error: error.message
    });
  }
};

// PATCH /api/users/:id/delete
exports.softDelete = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({ success: false, message: "User ID is required" });
    }

    if (req.user._id.toString() === id) {
      return res.status(400).send({ success: false, message: "You cannot delete your own account" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    if (user.isDeleted) {
      return res.status(400).send({ success: false, message: "User is already deleted" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        status: 'blocked',
        updatedAt: new Date().toISOString(),
        updatedBy: req.user._id
      },
      { new: true }
    ).select('-password');

    res.status(200).send({
      success: true,
      message: "User deactivated (soft deleted) successfully",
      user: updatedUser
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in soft deleting user",
      error: error.message
    });
  }
};


// PATCH /api/users/:id/reactivate
exports.reactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    if (!user.isDeleted) {
      return res.status(400).send({ success: false, message: "User is not deleted" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        isDeleted: false,
        status: 'active',
        updatedAt: new Date().toISOString(),
        updatedBy: req.user._id
      },
      { new: true }
    ).select('-password');

    res.status(200).send({
      success: true,
      message: "User reactivated successfully",
      user: updatedUser
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error reactivating user",
      error: error.message
    });
  }
};
