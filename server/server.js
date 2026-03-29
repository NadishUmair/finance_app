const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("App is running");
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log("App is running at", PORT);
});