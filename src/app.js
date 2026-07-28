const express = require("express");
const app = express();
app.use(express.json());

app.get("/health-check", (req, res) => {
  return res.status(200).json({ success: true, message: "server running up" });
});



module.exports = app;
