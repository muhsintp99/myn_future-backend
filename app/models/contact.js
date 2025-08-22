const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  location: { type: String, required: true },
  course: { type: String},
  school: { type: String},
  status: { type: String, enum: ['new', 'read', 'closed'], default: 'new' }
}, {
  timestamps: true
});

contactSchema.index({createdAt: 1});
const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;