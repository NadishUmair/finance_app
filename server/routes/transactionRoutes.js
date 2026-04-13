const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  importTransactions,
  uploadCSV,
} = require("../controllers/transactionController");
const upload = require("../util/upload");
const { protectedRoute } = require("../middlewares/authMiddleware");

router.post("/create",protectedRoute, createTransaction);
router.post("/import-transactions", protectedRoute, importTransactions);
router.post('/upload-csv',upload.single('file'), uploadCSV);
router.post('/upload-csv',upload.single('file'), uploadCSV);
router.get("/getTransactions", protectedRoute, getTransactions);
router.get("/:id", protectedRoute, getTransactionById);
router.patch("/:id", protectedRoute, updateTransaction);
router.delete("/:id", protectedRoute, deleteTransaction);

module.exports = router;
