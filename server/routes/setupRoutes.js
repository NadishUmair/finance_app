

const express = require('express');
const { createCategory, getCategories, creatAccount, getAccounts, deleteCategory, deleteAccount } = require('../controllers/setupControllers');
const { protectedRoute } = require('../middlewares/authMiddleware');
const router = express.Router();


router.post("/create-category",protectedRoute, createCategory);
router.get("/categories", protectedRoute, getCategories);
router.patch("/edit-category/:categoryId", protectedRoute, createCategory);
router.delete("/delete-category/:categoryId", protectedRoute,deleteCategory);

router.post("/create-account", protectedRoute, creatAccount);
router.get("/accounts", protectedRoute, getAccounts);
router.patch("/edit-account/:accountId", protectedRoute, creatAccount);
router.delete("/delete-account/:accountId", protectedRoute, deleteAccount);


module.exports = router;