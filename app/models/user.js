const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  fname: {
    type: String,
  },
  lname: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  mobile: {
    type: String,
    required: [true, "Mobile number is required"],
    unique: true,
  },
  password: { 
    type: String,
    required: [true, "Password is required"],
    minlength: 6
  },
  image: { 
    type: String,
    default: '/public/default/user.png'
  },
  userType: {
    type: String,
    required: [true, "User type is required"],
    enum: ['admin', 'licensee'],
    default: 'licensee'
  },
  deviceId: {
    type: String,
    default: null
  },
  ftLogin: {
    type: Boolean,
    default: true
  },
  vStatus: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['new', 'active', 'pending', 'blocked'],
    default: 'new'
  },
  crdtLmt: {
    type: Number,
    default: 0
  },
  country: {
    type: String,
    default: null
  },
  curncyCode: {
    type: String,
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: null
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null }
}, {
  timestamps: { 
    createdAt: 'createdAt', 
    updatedAt: 'updatedAt' 
  },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.fname} ${this.lname}`;
});

// Method to check if user is admin
UserSchema.methods.isAdminUser = function() {
  return this.userType === 'admin';
};

const User = mongoose.model("User", UserSchema);

module.exports = User;