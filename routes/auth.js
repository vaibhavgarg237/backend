const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	res.json({
		a: "random1",
		b: "random2",
	});
});

module.exports = router;
