
const Product = require("../models/productServices");


// Create User
exports.CreateProduct = async (req, res) => {
    try {
      const { name,descp,isActive} = req.body;

     
  
    const product = await new Product({ 
      name,
      descp,
      isActive: true ,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin',
      updatedBy: 'admin',
      isDeleted: false
    }).save()
    
        res.status(201).send({
          success: true,
          message: "Successfully created a Product",
          product,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error in creating a Product",
          error,
        });
      }
    };
    

// Get all Users
exports.GetAllProduct = async (req, res) => {
    try {
      const product = await Product.find({isDeleted:false}).sort({ createdAt :-1})  
      .populate('createdBy')
      .populate('updatedBy') ;
      res.status(200).send({
        success: true,
        message: "All Product",
        product,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in getting all Product",
        error,
      });
    }
  };


//get Product by id


exports.GetSingleProduct = async (req, res) => {
    try {
      const { id } = req.params;

   
      if (!id || id.toLowerCase() === 'null') {
        return res.status(400).send({
          success: false,
          message: "Invalid ID provided",
        });
      }

      const product = await Product.findById(id)
      .populate('createdBy')
      .populate('updatedBy') ;
  
      if (!product) {
        return res.status(404).send({
          success: false,
          message: "Product not found",
        });
      }
  
      res.status(200).send({
        success: true,
        message: "Getting single Product successfully",
        product,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in getting a single Product",
        error,
      });
    }
  };


exports.UpdateProduct = async (req, res) => {

    try {
      const { id } = req.params;
      const updatedData = req.body;
  
      const product = await Product.findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true,
      }).populate('createdBy')
      .populate('updatedBy') ;

      if (!product) {
        return res.status(404).send({
          success: false,
          message: "Product & Services ",
        });
      }
  
      res.status(200).send({
        success: true,
        message: "Successfully updated the Product",
        product: updatedData,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in updating the Product",
        error,
      });
    }
  };
  
// Delete Organization Type by ID (soft delete)
exports.softDelete= async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(
      id,
      { isDeleted: true, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('createdBy')
    .populate('updatedBy') ;

    if (!product) {
      return res.status(404).send({
        success: false,
        message: 'product & Services not found',
      });
    }

    res.status(200).send({
      success: true,
      message: 'Successfully soft-deleted the productServices',
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in soft-deleting the productServices',
      error,
    });
  }
};



