// const mongoose = require('mongoose');

// const collegeSchema = new mongoose.Schema({
//   image: {
//     type: String,
//   },
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//     unique: true
//   },
//   email: {
//     type: String,
//     required: true,
//     lowercase: true,
//     trim: true
//   },
//   phone: {
//     type: String,
//     trim: true
//   },
//   address: {
//     type: String,
//     trim: true
//   },
//   website: {
//     type: String,
//     trim: true
//   },
//   desc: {
//     type: String,
//     trim: true
//   },
//   country: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Country',
//     required: true,
//   },
//   state: { 
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'State',
//   },
//   courses: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Course',
//   }],
//   category: [{
//     type: String,
//     enum: ['Graduate', 'Postgraduate', 'Diploma', 'PhD'],
//   }],
//   status: {
//     type: String,
//     enum: ['new', 'recommended', 'popular', 'regular'],
//     default: 'new'
//   },
//   facilities: [{
//     type: String
//   }],
//   services: [{
//     type: String
//   }],
//   map: {
//     type: String 
//   },
//   visible: {
//     type: Boolean,
//     default: true,
//   },
//   createdBy: {
//     type: String,
//     default: 'admin'
//   },
//   updatedBy: {
//     type: String,
//     default: 'admin'
//   }
// }, {
//   timestamps: true
// });

// collegeSchema.index({ country: 1 });
// collegeSchema.index({ state: 1 });

// const College = mongoose.model('College', collegeSchema);
// module.exports = College;



const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  name: {
    type: String,
    required: [true, 'College name is required'],
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    unique: [true, 'Email must be unique']
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  desc: {
    type: String,
    trim: true
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: [true, 'Country is required'],
  },
  state: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State',
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  }],
  category: [{
    type: String,
    enum: {
      values: ['Graduate', 'Postgraduate', 'Diploma', 'PhD'],
      message: 'Invalid category value'
    }
  }],
  status: {
    type: String,
    enum: {
      values: ['new', 'recommended', 'popular', 'regular'],
      message: 'Invalid status value'
    },
    default: 'new'
  },
  facilities: [{
    type: String,
    trim: true
  }],
  services: [{
    type: String,
    trim: true
  }],
  map: {
    type: String 
  },
  visible: {
    type: Boolean,
    default: true,
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

collegeSchema.index({ country: 1 });
collegeSchema.index({ state: 1 });
collegeSchema.index({ email: 1 }, { unique: true });

const College = mongoose.model('College', collegeSchema);
module.exports = College;