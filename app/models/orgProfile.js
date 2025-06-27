const mongoose =require('mongoose')

const OrgProfileSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },     
      
  orgName: {
    type: String,
    required: true,
  },
  orgType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrgType', 
    required:true
  },
  orgCategory:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrgCategory', 
    required:true
  },
  orgLicense:{
    type:String
  },
 
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
    spoc: {
    spocName: String,
    spocEmail: String,
    spocMobile: String,
  },

  logo: {
    type: String,
   
  },
 document:{
  type:String,
},
ownership:{
    ownerName: String,
    ownerEmail: String,   
    ownerMobile: String, 
},
status: {
  type: String,  
  enum:['new','active','pending','blocked','converted']
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

const OrgProfile = mongoose.model('OrgProfile', OrgProfileSchema);

module.exports = OrgProfile;
