

const express = require('express');
const { createCategory, getCategories } = require('../controllers/setupControllers');
const { protectedRoute } = require('../middlewares/authMiddleware');
const router = express.Router();


router.post("/create-category",protectedRoute, createCategory);
router.get("/categories", protectedRoute, getCategories);

module.exports = router;