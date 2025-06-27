const OrgProfile = require('../models/orgProfile');
const fs = require("fs");

// Create Organization Profile
exports.createOrgProfile = async (req, res) => {


      if (!req.files.logo || !req.files.document) {
        res.status(400).send({ message: "Please upload both logo and document files!" });
        return;
      }  

  try {
    const {
      userId,
      orgName,
      orgType, 
      orgCategory, 
      orgLicense,
      address:{
        street,
        city,
        state,
        postalCode,
        country,
      },
        spoc :{
          spocName,
          spocEmail,
          spocMobile,
        },
        ownership:{
          ownerName,
          ownerEmail,
          ownerMobile, 
        },

    } = req.body;

    const orgProfile = await new OrgProfile({
        userId, 
      orgName,
      orgType,
      orgCategory,
      orgLicense,
      address:{
        street,
        city,
        state,
        postalCode,
        country,
      },
      spoc:{
        spocName,
        spocEmail,
        spocMobile,
      },
      ownership:{
        ownerName,
        ownerEmail,
        ownerMobile, 
      },
      logo: req.files.logo[0].filename,
      document: req.files.document[0].filename,
      status :'new',
      createdBy: 'admin',
      updatedBy: 'admin',
      createdAt: new Date(),
      updatedAt:  new Date(),
    }).save();

    res.status(201).send({
      success: true,
      message: 'Successfully created an organization profile',
      orgProfile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Error in creating an organization profile',
      error,
    });
  }
};

// Get all Organization Profiles
exports.getAllOrgProfiles = async (req, res) => {
  try {
    const orgProfiles = await OrgProfile.find().sort({ createdAt: -1 }) 
    .populate('orgType')
    .populate('userId')
    .populate('orgCategory');
    res.status(200).send({
      success: true,
      message: 'All organization profiles',
      orgProfiles,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Error in getting all organization profiles',
      error,
    });
  }
};

// Get Organization Profile by ID
exports.getSingleOrgProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const orgProfile = await OrgProfile.findById(id) 
     .populate('orgType')
     .populate('userId')
    .populate('orgCategory');

    if (!orgProfile) {
      return res.status(404).send({
        success: false,
        message: 'Organization profile not found',
      });
    }

    res.status(200).send({
      success: true,
      message: 'Getting single organization profile successfully',
      orgProfile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Error in getting a single organization profile',
      error,
    });
  }
};

// Update Organization Profile by ID
exports.updateOrgProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const orgProfile = await OrgProfile.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    })  .populate('orgType')
    .populate('userId')
    .populate('orgCategory');

    if (!orgProfile) {
      return res.status(404).send({
        success: false,
        message: 'Organization profile not found',
      });
    }

    res.status(200).send({
      success: true,
      message: 'Successfully updated the organization profile',
      orgProfile: updatedData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Error in updating the organization profile',
      error,
    });
  }
};

// Delete Organization Profile by ID (soft delete)
exports.softDeleteOrgProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const orgProfile = await OrgProfile.findByIdAndUpdate(
      id,
      { isDeleted: true, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!orgProfile) {
      return res.status(404).send({
        success: false,
        message: 'Organization profile not found',
      });
    }

    res.status(200).send({
      success: true,
      message: 'Successfully soft-deleted the organization profile',
      orgProfile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Error in soft-deleting the organization profile',
      error,
    });
  }
};
