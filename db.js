const mongoose = require("mongoose");
const mongooseURI = "mongodb://localhost:27017/?readPreference=primary";

const connect2Mongo = () => {
	mongoose.connect(mongooseURI, () => {
		console.log("Mongoose connected successfully");
	});
};

module.exports = connect2Mongo;
