const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'closed'], default: 'new' }
}, {
  timestamps: true
});

contactSchema.index({createdAt: 1});
const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;
