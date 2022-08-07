const connect2Mongo = require("./db");
const express = require("express");
const app = express();
const port = 3000;

connect2Mongo();

app.get("/", (req, res) => {
	res.send("Hello Vaibhav!");
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
