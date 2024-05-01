const express = require("express");
const passport = require("passport");

const {productController} = require("../controllers");
const isAdmin = (req, res, next) => {
  console.log(req.user);
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Only Admin can perform this operation' });
  }
};

const productRoutes = () => {
  const productRoutes = express.Router();
  
  const authenticate = passport.authenticate('jwt', { session: false });
  productRoutes.use(authenticate);
  
  productRoutes.get("/getall", productController.getallProducts);
  productRoutes.get("/find/:id", productController.searchProducts);
  productRoutes.use(isAdmin);
  productRoutes.post("/create",productController.createProduct);
  productRoutes.put("/update/:id", productController.updateProduct);
  productRoutes.delete("/delete/:id", productController.deleteProducts);

  return productRoutes;
};

module.exports = productRoutes