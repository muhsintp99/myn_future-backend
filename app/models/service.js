const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: String,
      default: 'admin',
    },
    updatedBy: {
      type: String,
      default: 'admin',
    },
  },
  { timestamps: true }
);

serviceSchema.index({ createdAt: 1 });
serviceSchema.index({ isDeleted: 1 });

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
