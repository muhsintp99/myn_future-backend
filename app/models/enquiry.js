const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  enqNo: {
    type: String,
    unique: true
  },
  followUpData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FollowUp"
  },
  fName: {
    type: String,
    required: true
  },
  enqDescp: {
    type: String
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  mobile: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  // course: {
  //   type: String,
  //   required: true
  // },
  // school: {
  //   type: String,
  //   required: true
  // },

  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },

  leadQuality: {
    type: String,
    enum: ["High", "Medium", "Low"]
  },
  status: {
    type: String,
    enum: ['new', 'active', 'pending', 'blocked', 'converted']
  },
  referenceId: {
    type: String
  },
  remarks: {
    type: String
  },
  category: {
    type: String,
    enum: ['Postgraduate', 'Graduate', 'Diploma', 'PhD', 'other']
  },
  createdBy: {
    type: String,
    default: 'admin'
  },
  updatedBy: {
    type: String,
    default: 'Admin'
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

enquirySchema.index({ createdAt: 1 });
enquirySchema.index({ isDeleted: 1 });

const Enquiry = mongoose.model('Enquiry', enquirySchema);

module.exports = Enquiry;
