const express = require("express");
const ProductServices = require('../Controllers/productServices'); 

const router = express.Router();

// Create a new organization category
router.post('/', ProductServices.CreateProduct);

// Get all organization categories
router.get('/', ProductServices.GetAllProduct);

// Update an existing organization category by ID
router.put('/:id', ProductServices.UpdateProduct);


// Soft Delete Organization Category by ID
router.patch('/:id', ProductServices.softDelete);


// Get a single organization category by ID
router.get('/:id', ProductServices.GetSingleProduct);

module.exports = router;