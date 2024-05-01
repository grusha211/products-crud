const Products = require("../models/productModel");
const User = require('../models/userModel');



class productController{
  static async createProduct(req, res) {
    const { name, price, description } = req.body;
    console.log("user",req.user);
    const product = new Products({ name, price, description });
    try {
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
    static async getallProducts(req,res){
        try {
            const products = await Products.find();
            res.json(products);
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
    }
    static async updateProduct(req,res){
        try {
            const { name, price , description } = req.body;
            const product = await Products.findByIdAndUpdate(req.params.id, {name, description , price});
            if (!product) {
              return res.status(404).json({ message: 'Products not found' });
            }else{
            res.json(product);}
          } catch (error) {
            res.status(400).json({ error: error.message });
          }
    }
    static async deleteProducts(req,res){
        try {
            const productId = req.params.id; 
            const product = await Products.findOneAndDelete({ _id: productId });
            if (!product) {
              return res.status(404).json({ message: 'Products not found' });
            }
            res.json({ message: 'Products deleted successfully' });
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
    }
    static async searchProducts(req,res){
        try {
            const productId = req.params.id;
            const products = await Products.find({
              _id: productId
            });
            res.json(products);
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
    }
    static async countProductss(req,res){
        try {
            const activeCount = await Products.countDocuments({ active: true });
            const inactiveCount = await Products.countDocuments({ active: false });
            res.json({ activeCount, inactiveCount });
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
    }
}

module.exports = productController