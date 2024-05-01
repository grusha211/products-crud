const express = require("express");

const {authController} = require("../controllers");

const userRoutes = () => {
  const userRoutes = express.Router();
  userRoutes.post("/login",authController.login);
  userRoutes.post("/signup",authController.signup);
  return userRoutes;
};

module.exports = userRoutes;
