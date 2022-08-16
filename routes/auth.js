const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchusers = require("../middleware/fetchusers");
const user = require("../models/User");

let success = false;

//Route 1: Create a user: POST  api/auth without user auth
router.post(
	"/createuser",
	[
		body("email", "Enter valid email").isEmail(),
		body("name", "Enter a valid name").isLength({ min: 3 }),
		body("password").isLength({ min: 5 }),
	],
	async (req, res) => {
		//if(errors) return bad request
		const errors = validationResult(req); //written above
		if (!errors.isEmpty()) {
			return res.status(400).json({ success, errors: errors.array() });
		}

		//duplicacy checks
		try {
			let user = await User.findOne({ email: req.body.email }); //await
			if (user) {
				return res
					.status(400)
					.json({ success, error: "A user with this email already exists!" });
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

			//Create authToken to return to user, data is id so that we can easily search afterwards in db,,, send user data signed with secret
			const data = {
				user: {
					id: user.id,
				},
			};
			const authToken = jwt.sign(data, "secretKeyStoredInConfig");
			res.json({ success: true, tokenn: authToken });
		} catch (error) {
			console.log(error.message);
			res.status(500).send("Internal server error");
		}
	}
);

//Roue 2: Authenticate a user: POST  api/auth without user auth, no login requied
router.post(
	"/login",
	[body("email", "Enter valid email").isEmail()],
	[body("password", "Password can't be blank").exists()],
	async (req, res) => {
		//if(errors) return bad request
		const errors = validationResult(req); //written above
		if (!errors.isEmpty()) {
			return res.status(400).json({ success, errors: errors.array() });
		}

		const { email, password } = req.body;
		try {
			//Find if user exists or not
			let user = await User.findOne({ email });
			if (!user) {
				return res
					.status(400)
					.json({ success, errors: "Please login with correct credentials!" });
			}
			//compare passwds
			const passwdCompare = await bcrypt.compare(password, user.password);
			if (!passwdCompare) {
				return res
					.status(400)
					.json({ success, errors: "Please login with correct credentials!" });
			}

			//When verified send user data signed with secret
			const data = {
				user: {
					id: user.id,
				},
			};
			const authToken = jwt.sign(data, "secretKeyStoredInConfig");
			res.json({ success: true, authToken });
		} catch (error) {
			console.log(error.message);
			res.status(500).send("Internal server error");
		}
	}
);

//Route 3: Get loggedin user details using: POST "/api/auth/getuser". Login required
router.post("/getuser", fetchusers, async (req, res) => {
	try {
		let userId = req.user.id;
		const user = await User.findById(userId).select("-password");
		res.send(user);
	} catch (error) {
		console.log(error.message);
		res.status(500).send("Internal server error");
	}
});

module.exports = router;
