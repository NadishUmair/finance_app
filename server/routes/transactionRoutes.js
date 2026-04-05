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

router.post("/", createTransaction);
router.post("/bulk", bulkCreateTransactions);
router.post('/upload-csv',upload.single('file'), uploadCSV);
router.get("/", getTransactions);
router.get("/:id", getTransactionById);
router.patch("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
