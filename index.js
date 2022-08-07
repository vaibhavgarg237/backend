const connect2Mongo = require("./db");
const express = require("express");
const app = express();
const port = 5000;

connect2Mongo();

app.use(express.json());

//Available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
