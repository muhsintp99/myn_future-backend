const OrgType = require('../models/orgType');

// Create Organization Type
exports.createOrgType = async (req, res) => {
  try {
    const { name, descp} = req.body;

    const existingType = await OrgType.findOne({ name });
    if (existingType) {
        return res.status(200).send({
            success: true,
        message: "This Org type already exists",
        });
    }

    const orgType = await new OrgType({
      name,
      descp,
      createdBy :'admin',
      updatedBy :'admin',
      createdAt: new Date().toISOString(),
      updatedAt:  new Date().toISOString(),
      isDeleted: false
    }).save();

    res.status(201).send({
      success: true,
      message: 'Successfully created an organization type',
      orgType,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in creating an organization type',
      error,
    });
  }
};

// Get all Organization Types
exports.getAllOrgTypes = async (req, res) => {
  try {
    const orgType = await OrgType.find().sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: 'All organization types',
      orgType,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in getting all organization types',
      error,
    });
  }
};

// Get Organization Type by ID
exports.getSingleOrgType = async (req, res) => {
  try {
    const { id } = req.params;
    const orgType = await OrgType.findById(id);

    if (!orgType) {
      return res.status(404).send({
        success: false,
        message: 'Organization type not found',
      });
    }

    res.status(200).send({
      success: true,
      message: 'Getting single organization type successfully',
      orgType,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in getting a single organization type',
      error,
    });
  }
};

// Update Organization Type by ID
exports.updateOrgType = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const orgType = await OrgType.findByIdAndUpdate( id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!orgType) {
      return res.status(404).send({
        success: false,
        message: 'Organization type not found',
      });
    }

    res.status(200).send({
      success: true,
      message: 'Successfully updated the organization type',
      orgType: updatedData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in updating the organization type',
      error,
    });
  }
};



  
// Delete Organization Type by ID (soft delete)
exports.softDeleteOrgType = async (req, res) => {
    try {
      const { id } = req.params;
      const orgType = await OrgType.findByIdAndUpdate(
        id,
        { isDeleted: true, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
  
      if (!orgType) {
        return res.status(404).send({
          success: false,
          message: 'Organization type not found',
        });
      }
  
      res.status(200).send({
        success: true,
        message: 'Successfully soft-deleted the organization type',
        orgType,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: 'Error in soft-deleting the organization type',
        error,
      });
    }
  };


// Hard Delete Organization Type by ID

/*exports.hardDeleteOrgType = async (req, res) => {
    try {
      const { id } = req.params;
      const orgType = await OrgType.findByIdAndRemove(id);
  
      if (!orgType) {
        return res.status(404).send({
          success: false,
          message: 'Organization type not found',
        });
      }
  
      res.status(200).send({
        success: true,
        message: 'Successfully hard-deleted the organization type',
        orgType,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: 'Error in hard-deleting the organization type',
        error,
      });
    }
  };
*/


// GET FULL COUNT OF user (including soft-deleted)
exports.findTotalOrgType = async (req, res) => {
    try {
      const { keyword } = req.query;
      const query = keyword ? { name: { $regex: keyword, $options: 'i' } } : {};
   
      const orgType = await OrgType.countDocuments(query);
      res.status(200).send({
        success: true,
        message: "Successfully found the count",
        orgType,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in counting the OrgType",
        error,
      });
    }
  };
  

  
// GET COUNT OF ACTIVE OrgType (excluding soft-deleted)
/*exports.findActiveOrgTypeCount = async (req, res) => {
    try {
      const { keyword } = req.query;
      const query = keyword ? { Name: { $regex: keyword, $options: 'i' }, IsDeleted: false } : { IsDeleted: false };
     
      const activeOrgTypeCount = await OrgType.countDocuments(query);
      res.status(200).send({
        success: true,
        message: "Successfully found the count of active OrgType",
        activeOrgTypeCount,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in counting the active OrgType",
        error,
      });
    }
  };
  */
  
  
  