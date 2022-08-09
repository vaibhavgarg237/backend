const express = require("express");
const router = express.Router();
const fetchusers = require("../middleware/fetchusers");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

//Route 1: Get all the notes: GET "/api/notes/fetchallnotes". Login required
router.get("/fetchallnotes", fetchusers, async (req, res) => {
	const notes = await Notes.find({ user: req.user.id });
	res.json(notes);
});

//Route 2: Add a new note: POST "/api/notes/addnote". Login required
router.post(
	"/addnote",
	fetchusers,
	[
		body("title", "Enter a valid title").isLength({ min: 3 }),
		body("description", "Enter valid description").isLength({ min: 5 }),
	],
	async (req, res) => {
		//if(errors) return bad request
		const errors = validationResult(req); //written above
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		try {
			//title,desc,tag are destructured and stored separately to create a new note obj
			const { title, description, tag } = req.body;
			const note = new Notes({
				title,
				description,
				tag,
				user: req.user.id,
			});
			const savedNote = await note.save();
			res.json(savedNote);
		} catch (error) {
			console.log(error.message);
			res.status(500).send("Internal server error");
		}
	}
);

module.exports = router;
