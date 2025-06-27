const  express = require('express');
const OrgType =require('../Controllers/orgType'); 

const router = express.Router();


// Create a new enquiry
router.post('/', OrgType.createOrgType);

// Get all enquiries
router.get('/', OrgType.getAllOrgTypes);

// Update an existing enquiry by ID
router.put('/:id', OrgType.updateOrgType);


//get count

router.get('/count',OrgType.findTotalOrgType);


// Get count of active OrgType
//router.get('/active-count', OrgType.findActiveOrgTypeCount);



// Soft Delete Organization Type by ID
router.patch('/:id', OrgType.softDeleteOrgType);

// Hard Delete Organization Type by ID
//router.delete('/hard-delete/:id', OrgType.hardDeleteOrgType);


// Get a single enquiry by ID
router.get('/:id', OrgType.getSingleOrgType);

module.exports = router;
