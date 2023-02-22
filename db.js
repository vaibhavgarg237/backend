const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const mongooseURI = process.env.MONGO_URI;

console.log("Trying to connect mongodb");
const connect2Mongo = () => {
  mongoose.connect(mongooseURI, () => {
    console.log("Mongoose connected successfully");
  });
};

module.exports = connect2Mongo;
