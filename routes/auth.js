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
	async (req, res) => {
		//if(errors) return bad request
		const errors = validationResult(req); //written above
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		//duplicacy checks
		try {
			let user = await User.findOne({ email: req.body.email }); //await
			if (user) {
				return res
					.status(400)
					.json({ error: "A user with this email already exists!" });
			}

			//Create a user
			user = await User.create({
				//await
				name: req.body.name,
				password: req.body.password,
				email: req.body.email,
			});
			res.json(user);
		} catch (error) {
			console.log(error.message);
			res.status(500).send("some error occured");
		}
	}
);

module.exports = router;
