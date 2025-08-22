const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({

  enqId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enquiry',
    required: true
  },

  followUpDetails: {
    type: String,
  },
  nextContactDate: {
    type: Date,

  },
  status: {
    type: String,
    enum: ['new', 'active', 'pending', 'blocked', 'converted']
  },
  remarks: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
    required: true,
    default: 'admin'

  },
  updatedBy: {
    type: String,
    required: true,
    default: 'admin'
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },

});

const FollowUp = mongoose.model("FollowUp", followUpSchema);

module.exports = FollowUp;
