const  express = require('express');
const supportType =require('../Controllers/supportType'); 

const router = express.Router();


// Create a new enquiry
router.post('/', supportType.CreateSupportType);

// Get all enquiries
router.get('/', supportType.GetAllSupportType);

// Update an existing enquiry by ID
router.put('/:id', supportType.UpdateSupportType);



//Soft  Delete an enquiry by ID
router.patch('/:id',supportType.softDelete);


// Get a single enquiry by ID
router.get('/:id', supportType.GetSingleSupportType);

module.exports = router;
