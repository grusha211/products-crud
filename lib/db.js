const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async (cb) => {
  // Connect to the MongoDB database
  try {
    const db = mongoose.connect(process.env.DBURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoose.set("debug", false);
    if (cb) cb(db);
  } catch (err) {
    console.log("Database not connected.", err);
  }
};

module.exports = connectDB;
