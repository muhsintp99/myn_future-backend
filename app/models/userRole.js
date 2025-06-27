const mongoose = require('mongoose');

const userRoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum:['admin', 'licensee','vendor','operator','accountant']
  },
  desc: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum:['new','active','pending','blocked','converted']
    },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  createdBy:{
    type:String
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: String,
  },
  isDeleted:{
    type:Boolean,
    default:false
  }
});

const UserRole = mongoose.model('UserRole', userRoleSchema);

module.exports = UserRole;
