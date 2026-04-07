const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  bulkCreateTransactions,
  uploadCSV,
} = require("../controllers/transactionController");
const upload = require("../util/upload");
const { protectedRoute } = require("../middlewares/authMiddleware");

router.post("/",protectedRoute, createTransaction);
router.post("/bulk", protectedRoute, bulkCreateTransactions);
router.post('/upload-csv',upload.single('file'), uploadCSV);
router.get("/", protectedRoute, getTransactions);
router.get("/:id", protectedRoute, getTransactionById);
router.patch("/:id", protectedRoute, updateTransaction);
router.delete("/:id", protectedRoute, deleteTransaction);

module.exports = router;
