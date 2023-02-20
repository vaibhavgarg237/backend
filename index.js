const connect2Mongo = require("./db");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

connect2Mongo();

app.get("/", (req, res) => {
  console.log("Home end point hit");
  res.send("Testing my server");
});
app.use(cors());
app.use(express.json());

//Available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`iNotes-backend app listening on port ${port}`);
});
