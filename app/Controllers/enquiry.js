const Enquiry = require("../models/enquiry");
const cron = require('node-cron');
const { sendWelcomeEmail } = require("../helpers/sendEmail");

// Create Enquiry
exports.CreateEnquiryController = async (req, res) => {
  try {
    const {
      fName,
      email,
      mobile,
      location,
      course,
      school,
      leadQuality,
      enqTo,
      enqDescp,
      referenceId,
      remarks,
    } = req.body;

    if (!enqDescp || !fName || !email || !mobile || !location) {
      return res.status(400).send({ message: "All required fields must be provided" });
    }

    const existingEnquiry = await Enquiry.findOne({ email });
    if (existingEnquiry) {
      return res.status(200).send({
        success: true,
        message: "Enquiry with this email already exists",
      });
    }

    const maxEnqNo = await Enquiry.find().sort({ enqNo: -1 }).limit(1);
    let newEnqNo;
    if (maxEnqNo.length > 0) {
      const numericPart = parseInt(maxEnqNo[0].enqNo.slice(3), 10);
      newEnqNo = `Enq${(numericPart + 1).toString().padStart(2, '0')}`;
    } else {
      newEnqNo = 'Enq01'; // Fixed initial enqNo to 'Enq01' instead of 'Enq0'
    }

    const enquiry = await new Enquiry({
      enqNo: newEnqNo,
      enqDescp,
      fName,
      email,
      mobile,
      location,
      course,
      school,
      leadQuality,
      enqTo,
      status: 'new',
      referenceId,
      remarks,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin',
      updatedBy: 'admin',
      isDeleted: false
    }).save();

    await sendWelcomeEmail(email, `${fName}`);

    const sseClients = req.app.get('sseClients');
    const eventData = JSON.stringify({
      id: enquiry._id,
      fName: enquiry.fName,
      enqNo: enquiry.enqNo,
      createdAt: enquiry.createdAt,
      message: `It's ${enquiry.fName}'s Enquiries Notification`,
    });
    sseClients.forEach(client => {
      client.write(`event: newEnquiry\ndata: ${eventData}\n\n`);
    });

    res.status(201).send({
      success: true,
      message: "Successfully created an enquiry",
      enquiry,
    });
  } catch (error) {
    console.log(error);
    if (error.code === 11000 && error.keyPattern.email) {
      return res.status(400).send({
        success: false,
        message: "Email must be unique. The provided email is already in use."
      });
    }
    res.status(500).send({
      success: false,
      message: "Error in creating an enquiry",
      error,
    });
  }
};

// Function to check and update status
const checkAndUpdateStatus = async () => {
  try {
    const enquiries = await Enquiry.find({ status: 'new', isDeleted: false });
    enquiries.forEach(async (enquiry) => {
      const createdDate = new Date(enquiry.createdAt);
      const currentDate = new Date();
      if (createdDate > currentDate) {
        console.warn(`Enquiry ${enquiry._id} has a future created date.`);
        return;
      }
      const timeDifference = currentDate - createdDate;
      if (timeDifference > 24 * 60 * 60 * 1000) {
        await Enquiry.findByIdAndUpdate(enquiry._id, { status: 'pending' });
      }
    });
  } catch (error) {
    console.error('Error checking and updating status:', error);
  }
};

// Run every hour
cron.schedule('0 * * * *', () => {
  checkAndUpdateStatus();
});

// Get all Enquiries
exports.GetAllEnquiriesController = async (req, res) => {
  try {
    const enquiry = await Enquiry.find({ isDeleted: false })
      .populate('school', 'name')
      .populate('course', 'title')
      .sort({ createdAt: -1 });
    const total = await Enquiry.countDocuments({ isDeleted: false });
    const formattedEnquiries = enquiry.map((enq) => ({
      ...enq.toObject(),
      followUpDataPrsnt: enq.followUpData && enq.followUpData.length > 0,
    }));
    res.status(200).send({
      success: true,
      message: "All enquiries",
      count: total,
      enquiry: formattedEnquiries,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting all enquiries",
      error,
    });
  }
};

// Get Single Enquiry by ID
exports.GetSingleEnquiryController = async (req, res) => {
  try {
    const { id } = req.params;
    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      return res.status(404).send({
        success: false,
        message: "Enquiry not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Getting single enquiry successfully",
      enquiry,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting a single enquiry",
      error,
    });
  }
};

// Update Enquiry
exports.UpdateEnquiryController = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!enquiry) {
      return res.status(404).send({
        success: false,
        message: "Enquiry not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Successfully updated the enquiry",
      enquiry,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating the enquiry",
      error,
    });
  }
};

// Soft Delete Enquiry by ID
exports.softDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      { isDeleted: true, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    res.status(200).send({
      success: true,
      message: "Successfully deleted the enquiry",
      enquiry,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in deleting the enquiry",
      error,
    });
  }
};

// Enquiry count
exports.enquiryCount = async (req, res) => {
  try {
    const enquiry = await Enquiry.countDocuments();
    res.status(200).send({
      success: true,
      enquiry
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting count",
      error
    });
  }
};

// Update Enquiry Status to Active
exports.UpdateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      { status: 'active', updatedAt: Date.now(), updatedBy: 'admin' },
      { new: true, runValidators: true }
    );
    if (!enquiry) {
      return res.status(404).send({
        success: false,
        message: "Enquiry not found",
      });
    }
    res.status(200).send({
      success: true,
      // message: "Enquiry status updated to active",
      enquiry,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error updating enquiry status",
      error,
    });
  }
};

// Get New Enquiry Count and Details
exports.getNewEnquiryCount = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ status: 'new', isDeleted: false })
      .select('_id fName enqNo createdAt')
      .sort({ createdAt: -1 });
    const count = enquiries.length;
    res.status(200).send({
      success: true,
      count,
      enquiries: enquiries.map(enq => ({
        id: enq._id,
        fName: enq.fName,
        enqNo: enq.enqNo,
        createdAt: enq.createdAt,
      })),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error getting new enquiry count",
      error,
    });
  }
};