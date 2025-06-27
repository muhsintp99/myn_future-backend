const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
    default: '/public/defult/picture.png'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    uppercase: true,
    minlength: 2,
    maxlength: 3,
    unique: true
  },
  isoCode: {
    type: String,
    required: true,
    uppercase: true,
    minlength: 3,
    maxlength: 3,
    unique: true
  },
  dialCode: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true,
    uppercase: true
  },
  publicId: {
    type: String
  },
  isDomestic: {
    type: Boolean,
    default: false
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: String,
    default: 'admin'
  },
  updatedBy: {
    type: String,
    default: 'admin'
  }
}, {
  timestamps: true
});

// Pre-save hook to auto-set domestic/default flags for India
countrySchema.pre('save', function (next) {
  if (this.name && this.name.toLowerCase() === 'india') {
    this.isDomestic = true;
    this.isDefault = true;
  }
  next();
});

const Country = mongoose.model('Country', countrySchema);
module.exports = Country;