const  express = require('express');
const userRoleController =require('../Controllers/userRole'); 

const router = express.Router();



// Create a new userrole
router.post('/', userRoleController.CreateUserRoleController );

// Get all userrole
router.get('/', userRoleController.GetAllUserRoleController);

// Update an existing userrole by ID
router.put('/:id', userRoleController.UpdateUserRoleController );


// Get a single userrole by ID
router.get('/:id', userRoleController.GetSingleUserRoleController);

// Delete an userrole by ID
router.patch('/:id',userRoleController.softDeleteUserRole);

module.exports = router;