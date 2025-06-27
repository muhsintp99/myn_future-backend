import IntakeCollege from '../models/intakeCollege.js';
import mongoose from 'mongoose';

// Auto-update status if deadline is passed (run separately, e.g., via cron)
const updateStatusIfDeadlinePassed = async () => {
  const today = new Date();
  await IntakeCollege.updateMany(
    {
      deadlineDate: { $lte: today },
      status: { $ne: 'closed' },
      isDeleted: false,
    },
    { $set: { status: 'closed' } }
  );
};

// @desc    Create Intake
export const createIntake = async (req, res) => {
  try {
    console.log('Create Intake Request Body:', JSON.stringify(req.body, null, 2));
    
    const { college, intakeMonth, intakeYear, deadlineDate, status, visible } = req.body;

    // Detailed validation with specific error messages
    const validationErrors = [];

    if (!college || college === '') {
      validationErrors.push('College is required and cannot be empty');
    } else if (!mongoose.Types.ObjectId.isValid(college)) {
      validationErrors.push('College must be a valid ObjectId');
    }

    if (!intakeMonth || intakeMonth.trim() === '') {
      validationErrors.push('Intake month is required and cannot be empty');
    }

    if (!intakeYear || intakeYear === '' || isNaN(intakeYear)) {
      validationErrors.push('Intake year is required and must be a valid number');
    } else if (intakeYear < new Date().getFullYear()) {
      validationErrors.push('Intake year cannot be in the past');
    }

    if (!deadlineDate || deadlineDate === '') {
      validationErrors.push('Deadline date is required');
    } else if (isNaN(Date.parse(deadlineDate))) {
      validationErrors.push('Deadline date must be a valid date');
    }

    if (status && !['open', 'closed'].includes(status)) {
      validationErrors.push('Status must be either "open" or "closed"');
    }

    if (visible !== undefined && typeof visible !== 'boolean') {
      validationErrors.push('Visible must be a boolean value');
    }

    // If there are validation errors, return them
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors,
        receivedData: {
          college,
          intakeMonth,
          intakeYear,
          deadlineDate,
          status,
          visible,
        }
      });
    }

    // Create intake data object
    const intakeData = {
      college: new mongoose.Types.ObjectId(college),
      intakeMonth: intakeMonth.trim(),
      intakeYear: parseInt(intakeYear),
      deadlineDate: new Date(deadlineDate),
      status: status || 'open',
      visible: visible !== undefined ? visible : true,
      createdBy: req.user ? req.user._id : null,
      createdAt: new Date(),
    };

    console.log('Processed Intake Data:', JSON.stringify(intakeData, null, 2));

    // Create new intake instance and save it
    const newIntake = new IntakeCollege(intakeData);
    const saved = await newIntake.save();

    console.log('Saved Intake:', saved);

    // Populate the saved intake
    const populatedIntake = await IntakeCollege.findById(saved._id)
         .populate({
           path: 'college',
           match: { isDeleted: false },
           select: '-__v -createdBy -updatedBy -isDeleted -createdAt -updatedAt'
         });

    res.status(201).json({
      success: true,
      message: 'Intake created successfully',
      data: populatedIntake
    });
  } catch (error) {
    console.error('Create Intake Error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));
      
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors,
        type: 'ValidationError'
      });
    }

    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// @desc    Get all Intakes
export const getAllIntakes = async (req, res) => {
  try {
    const intakes = await IntakeCollege.find({ 
      isDeleted: false // Return all non-deleted intakes, regardless of visible status
    })
      .populate({
        path: 'college',
        match: { isDeleted: false },
        select: '-__v -createdBy -updatedBy -isDeleted -createdAt -updatedAt'
      })
      .sort({ intakeYear: -1, intakeMonth: 1 });

    res.json({
      success: true,
      count: intakes.length,
      data: intakes
    });
  } catch (error) {
    console.error('Get All Intakes Error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Get single intake by ID
export const getIntakeById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid intake ID format' 
      });
    }

    const intake = await IntakeCollege.findOne({ 
      _id: req.params.id, 
      isDeleted: false 
    }).populate({
      path: 'college',
      match: { isDeleted: false },
      select: '-__v -createdBy -updatedBy -isDeleted -createdAt -updatedAt'
    });

    if (!intake) {
      return res.status(404).json({ 
        success: false,
        message: 'Intake not found' 
      });
    }

    res.json({
      success: true,
      data: intake
    });
  } catch (error) {
    console.error('Get Intake By ID Error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Update Intake
export const updateIntake = async (req, res) => {
  try {
    console.log('Update Intake Request Body:', JSON.stringify(req.body, null, 2));
    
    const { college, intakeMonth, intakeYear, deadlineDate, status, visible } = req.body;

    // Validate college field if provided
    if (college && !mongoose.Types.ObjectId.isValid(college)) {
      return res.status(400).json({ 
        success: false,
        message: 'Valid college ID is required' 
      });
    }

    // Validate other fields if provided
    if (intakeMonth && !intakeMonth.trim()) {
      return res.status(400).json({ 
        success: false,
        message: 'Intake month cannot be empty' 
      });
    }
    if (intakeYear && isNaN(intakeYear)) {
      return res.status(400).json({ 
        success: false,
        message: 'Valid intake year is required' 
      });
    }
    if (deadlineDate && isNaN(Date.parse(deadlineDate))) {
      return res.status(400).json({ 
        success: false,
        message: 'Valid deadline date is required' 
      });
    }
    if (status && !['open', 'closed'].includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: 'Status must be either "open" or "closed"' 
      });
    }
    if (visible !== undefined && typeof visible !== 'boolean') {
      return res.status(400).json({ 
        success: false,
        message: 'Visible must be a boolean value' 
      });
    }

    // Prevent setting status to open if deadline has passed
    if (status === 'open' && deadlineDate) {
      const deadline = new Date(deadlineDate);
      const today = new Date();
      if (deadline < today) {
        return res.status(400).json({ 
          success: false,
          message: 'Cannot set status to open for a past deadline' 
        });
      }
    }

    // Update intake with validated data
    const updateData = {
      updatedAt: new Date(),
      updatedBy: req.user ? req.user._id : null,
    };
    
    if (college) updateData.college = new mongoose.Types.ObjectId(college);
    if (intakeMonth) updateData.intakeMonth = intakeMonth.trim();
    if (intakeYear) updateData.intakeYear = parseInt(intakeYear);
    if (deadlineDate) updateData.deadlineDate = new Date(deadlineDate);
    if (status) updateData.status = status;
    if (visible !== undefined) updateData.visible = visible;

    const intake = await IntakeCollege.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      updateData,
      { new: true, runValidators: true }
    ).populate({
      path: 'college',
      match: { isDeleted: false },
      select: '-__v -createdBy -updatedBy -isDeleted -createdAt -updatedAt'
    });

    if (!intake) {
      return res.status(404).json({ 
        success: false,
        message: 'Intake not found' 
      });
    }

    res.json({
      success: true,
      message: 'Intake updated successfully',
      data: intake
    });
  } catch (error) {
    console.error('Update Intake Error:', error);
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Delete Intake (Soft Delete)
export const deleteIntake = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid intake ID format' 
      });
    }

    const intake = await IntakeCollege.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      {
        deletedAt: new Date(),
        deletedBy: req.user ? req.user._id : null,
        isDeleted: true,
        visible: false, // Set visible to false on soft delete
      },
      { new: true }
    );

    if (!intake) {
      return res.status(404).json({ 
        success: false,
        message: 'Intake not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'Intake deleted successfully', 
      data: intake 
    });
  } catch (error) {
    console.error('Delete Intake Error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Hard Delete Intake
export const hardDeleteIntake = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid intake ID format' 
      });
    }

    const intake = await IntakeCollege.findByIdAndDelete(req.params.id);

    if (!intake) {
      return res.status(404).json({ 
        success: false,
        message: 'Intake not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'Intake permanently deleted', 
      id: req.params.id 
    });
  } catch (error) {
    console.error('Hard Delete Intake Error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// @desc    Count of active intakes
export const getIntakeCount = async (req, res) => {
  try {
    const count = await IntakeCollege.countDocuments({ 
      isDeleted: false
    });
    res.json({ 
      success: true,
      count 
    });
  } catch (error) {
    console.error('Get Intake Count Error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Export the utility function as well
export { updateStatusIfDeadlinePassed };