
const SupportType = require("../models/supportType");

// Create User
exports.CreateSupportType = async (req, res) => {
  try {

    const { name, descp} = req.body;

    const supportType = await new SupportType({
      name,
      descp,
      isActive: true ,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin',
      updatedBy: 'admin',
      isDeleted: false
    }).save()

   
    res.status(201).send({
      success: true,
      message: "Successfully created a enquirySupport",
      supportType,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating a enquirySupport",
      error,
    });
  }
};


// Get all Users
exports.GetAllSupportType = async (req, res) => {
  try {
    const supportType = await SupportType.find({isDeleted:false}).sort({ createdAt: -1 })
      .populate('createdBy')
      .populate('updatedBy');
    res.status(200).send({
      success: true,
      message: "All supportType",
      supportType,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting all supportType",
      error,
    });
  }
};


//get supportType by id


exports.GetSingleSupportType = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id.toLowerCase() === 'null') {
      return res.status(400).send({
        success: false,
        message: "Invalid ID provided",
      });
    }

    const supportType = await SupportType.findById(id)
      .populate('createdBy')
      .populate('updatedBy');

    if (!supportType) {
      return res.status(404).send({
        success: false,
        message: "supportType not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Getting single supportType successfully",
      supportType,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting a single supportType",
      error,
    });
  }
};


exports.UpdateSupportType = async (req, res) => {

  try {
    const { id } = req.params;
    const updatedData = req.body;

    const supportType = await SupportType.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    }).populate('createdBy')
      .populate('updatedBy');

    if (!supportType) {
      return res.status(404).send({
        success: false,
        message: "Support not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Successfully updated the supportType",
      supportType: updatedData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in updating the supportType",
      error,
    });
  }
};

// Delete supportType by ID (soft delete)
exports.softDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const supportType = await SupportType.findByIdAndUpdate(
      id,
      { isDeleted: true, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('createdBy')
      .populate('updatedBy');

    if (!supportType) {
      return res.status(404).send({
        success: false,
        message: 'Organization type not found',
      });
    }

    res.status(200).send({
      success: true,
      message: 'Successfully soft-deleted the supportType',
      supportType,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in soft-deleting the supportType',
      error,
    });
  }
};


