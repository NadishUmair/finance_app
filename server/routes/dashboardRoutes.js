
const express = require("express");
const { getStats } = require("../controllers/dashboardController");
const { protectedRoute } = require("../middlewares/authMiddleware");
const router = express.Router();




router.get("/stats",protectedRoute, getStats);

module.exports = router;