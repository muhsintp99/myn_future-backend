const UserRole = require("../models/userRole");
const mongoose = require('mongoose');


// Create Enquiry
exports.CreateUserRoleController = async (req, res) => {

    try{
       const { name, desc} = req.body;
       if(!name || !desc){
        return res.status(400).send({ message: "All required fields must be provided"});
       }
  
       const existingUserRole = await UserRole.findOne({ name });
    if (existingUserRole) {
        return res.status(200).send({
            success: true,
        message: "User with this name already exists",
        });
    }
    const userRole = await new UserRole({
      name,
      desc,
      status: "new", // Default status
      createdAt: new Date().toISOString(),
       updatedAt: new Date().toISOString(),
       createdBy :'admin',
       updatedBy :'admin',
       isDeleted: false
  }).save();

    res.status(201).send({
        success: true,
        message: "Successfully created an userrole",
        userRole,
      });
}catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating an userrole",
      error,
    });
  }

};



// Updated EnquirySource
exports.UpdateUserRoleController = async (req, res) => {
  try {
      const { id } = req.params;
      const updatedData = req.body;

      const userRole = await UserRole.findByIdAndUpdate(id, updatedData, {
          new: true,
          runValidators: true,
      });

      if (!userRole) {
          return res.status(404).send({
              success: false,
              message: "UserRole not found",
          });
      }

      res.status(200).send({
          success: true,
          message: "Successfully updated the userroles",
          userRole: userRole,
      });
  } catch (error) {
      console.log(error);
      res.status(500).send({
          success: false,
          message: "Error in updating the userrole",
          error,
      });
  }
};

// Get all Enquiries
exports.GetAllUserRoleController = async (req, res) => {
  try {
    const userRole = await UserRole.find().sort({createdAt:-1});
    res.status(200).send({
      success: true,
      message: "All enquiries",
      userRole,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting all userRole",
      error,
    });
  }
};

exports.GetSingleUserRoleController = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Validate that 'id' is a valid ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send({
        success: false,
        message: "Invalid ID format",
      });
    }

    const userRole = await UserRole.findById(id);

    if (!userRole) {
      return res.status(404).send({
        success: false,
        message: "Userrole not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Getting single userrole successfully",
      userRole,
    });
  } catch (error) {
    console.error('Error in GetSingleUserRoleController:', error);
    res.status(500).send({
      success: false,
      message: "Error in getting a single userrole",
      error,
    });
  }
};




// Delete EnquiryType by ID
exports.softDeleteUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const Userrole = await UserRole.findByIdAndUpdate(
      id,
      { isDeleted: true, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    res.status(200).send({
      success: true,
      message: "Successfully deleted the UserRole",
      Userrole,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in deleting the UserRole",
      error,
    });
  }
};
