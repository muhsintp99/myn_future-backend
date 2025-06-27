const mongoose = require("mongoose");

const orgTypeSchema  = new mongoose.Schema({
name: {
  type: String, unique: true, required: true
  },
 descp :{
  type: String,
  required: true,
},

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdBy:{
    type: String,
    required: true,
    default:'admin'

},
    updatedBy:{
    type: String,
    required: true,
    default:'admin'
},

   isDeleted: {
    type: Boolean,
    default: false, 
  },
  
});

const OrgType = mongoose.model("OrgType", orgTypeSchema);

module.exports = OrgType;
