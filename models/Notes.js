const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotesSchema = new Schema(
	{
		//user is like foreign key!!!
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		tag: {
			type: String,
			default: "General",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("notes", NotesSchema);
