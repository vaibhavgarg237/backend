const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

			//Hash passwd securely
			const salt = await bcrypt.genSalt(10);
			let secPass = await bcrypt.hash(req.body.password, salt);

			//Create a user
			user = await User.create({
				//await
				name: req.body.name,
				password: secPass,
				email: req.body.email,
			});

			//Create authToken to return to user, data is id so that we can easily search afterwards in db
			const data = {
				user: {
					id: user.id,
				},
			};
			const authToken = jwt.sign(data, "secretKeyStoredInConfig");
			res.json({ authToken });
		} catch (error) {
			console.log(error.message);
			res.status(500).send("some error occured");
		}
	}
);

module.exports = router;
