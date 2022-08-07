const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

//Create a user: POST  api/auth without user auth
router.post(
	"/",
	[
		body("email", "Enter valid email").isEmail(),
		body("name", "Enter a valid name").isLength({ min: 3 }),
		body("password").isLength({ min: 5 }),
	],
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		User.create({
			name: req.body.name,
			password: req.body.password,
			email: req.body.email,
		})
			.then((user) => res.json(user)) //return JSON
			.catch((err) => {
				res.json({ error: "Please enter unique values", message: err.message });
			});
	}
);

module.exports = router;
