const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    shortDesc: {
      type: String,
      required: [true, 'Short description is required'],
    },
    fullDesc: {
      type: String,
      required: [true, 'Full description is required'],
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    points: [
      {
        title: {
          type: String,
        },
        description: {
          type: String,
        },
      },
    ],
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