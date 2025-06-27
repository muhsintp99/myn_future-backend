const Contact = require('../models/contact');

// Create a new contact message
exports.createContact = async (req, res) => {
  try {
    const { fullname, mobile, email, subject, message } = req.body;
    if (!fullname || !mobile || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newContact = new Contact({ fullname, mobile, email, subject, message });
    await newContact.save();

    res.status(201).json({ message: 'Contact message created successfully.', data: newContact });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Get all contact messages
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Update status
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['new', 'read', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const updated = await Contact.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Contact message not found.' });
    }

    res.json({ message: 'Status updated.', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Hard delete one
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Contact.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Contact message not found.' });
    }

    res.json({ message: 'Contact message permanently deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Hard delete all
exports.deleteAllContacts = async (req, res) => {
  try {
    await Contact.deleteMany({});
    res.json({ message: 'All contact messages permanently deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Get total and new counts
exports.getCount = async (req, res) => {
  try {
    const totalCount = await Contact.countDocuments();
    const newCount = await Contact.countDocuments({ status: 'new' });

    res.json({ totalCount, newCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
