const mongoose = require("mongoose");

const SupportTypeSchema = new mongoose.Schema({
name: {
    type: String,
    required: true,
  },
 descp :{
  type: String,
  required: true,
},
isActive:{
  type: Boolean,
  required: true,
  default: true
  
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
  /* type: mongoose.Schema.Types.ObjectId,
    ref: 'user'*/
    type: String,
    default:'admin'
  },
   updatedBy:{
  /* type: mongoose.Schema.Types.ObjectId,
    ref: 'user' */
    type:String,
    default :'admin'
   
    
  },

isDeleted: {
  type: Boolean,
  default: false, 
},

});

const SupportType = mongoose.model("SupportType", SupportTypeSchema);

module.exports = SupportType;
