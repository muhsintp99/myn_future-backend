const FollowUp = require("../models/followUp");
const mongoose = require("mongoose");
const moment = require("moment");
/*
// Function to format date as "DD-MM-YYYY"
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
*/
// Create FollowUp
exports.CreateFollowUp = async (req, res) => {
  try {
    const { enqId, followUpDetails, nextContactDate, remarks } = req.body;

    if (!mongoose.Types.ObjectId.isValid(enqId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid Enquiry ID provided",
      });
    }
    /*   const parsedNextContactDate = new Date(nextContactDate);
   
       if (isNaN(parsedNextContactDate.getTime())) {
         return res.status(400).send({
           success: false,
           message: "Invalid nextContactDate provided",
         });
       }
   */

    const followUp = await new FollowUp({
      enqId,
      followUpDetails,
      nextContactDate,
      status: "new",
      remarks,
      createdBy: 'admin',
      updatedBy: 'admin',

    }).save();

    res.status(201).send({
      success: true,
      message: "Successfully created a follow-up",
      followUp
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating a follow-up",
      error,
    });
  }
};

// Get all FollowUps
exports.GetAllFollowUps = async (req, res) => {
  try {
    const followUp = await FollowUp.find({ isDeleted: false }).sort({ createdAt: -1 })
      .populate('enqId');



    res.status(200).send({
      success: true,
      message: "All follow-ups",
      followUp

    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting all follow-ups",
      error,
    });
  }
};

// Get FollowUp by id
exports.GetSingleFollowUp = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid ID provided",
      });
    }

    const followUp = await FollowUp.findById(id)
      .populate('enqId');

    if (!followUp) {
      return res.status(404).send({
        success: false,
        message: "Follow-up not found",
      });
    }


    res.status(200).send({
      success: true,
      message: "Getting single follow-up successfully",
      followUp
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting a single follow-up",
      error,
    });
  }
};

// Get all FollowUps for a specific Enquiry
exports.GetAllFollowUpsForEnquiry = async (req, res) => {
  try {
    const { enquiryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(enquiryId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid Enquiry ID provided",
      });
    }

    const followUp = await FollowUp.find({ enqId: enquiryId })
      .sort({ createdAt: -1 });



    res.status(200).send({
      success: true,
      message: "All follow-ups for the Enquiry",
      followUp
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting follow-ups for the Enquiry",
      error,
    });
  }
};


// Update FollowUp by id
exports.UpdateFollowUp = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const followUp = await FollowUp.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    }).populate('enqId');

    if (!followUp) {
      return res.status(404).send({
        success: false,
        message: "Follow-up not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Successfully updated the follow-up",
      followUp: updatedData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating the follow-up",
      error,
    });
  }
};

// Soft Delete FollowUp by ID
exports.softDeleteFollowUp = async (req, res) => {
  try {
    const { id } = req.params;
    const followUp = await FollowUp.findByIdAndUpdate(
      id,
      { isDeleted: true, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('enqId');
    if (!followUp) {
      return res.status(404).send({
        success: false,
        message: 'Follow-up not found',
      });
    }

    res.status(200).send({
      success: true,
      message: 'Successfully soft-deleted the follow-up',
      followUp,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in soft-deleting the follow-up',
      error,
    });
  }
};


exports.deleteFollowUp = async (req, res) => {
  try {
    const deleted = await FollowUp.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).send({
        success: false,
        message: 'Follow-up not found',
      });
    }

    res.status(200).send({
      success: true,
      message: 'Successfully soft-deleted the follow-up',
      deleted,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in soft-deleting the follow-up',
      error,
    });
  }
};
