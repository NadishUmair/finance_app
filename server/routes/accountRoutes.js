const express = require("express");
const router = express.Router();
const {
  createAccount,
  getAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
  getChartOfAccounts
} = require("../controllers/accountController");

router.post("/", createAccount);
router.get("/", getAccounts);
router.get("/chart", getChartOfAccounts);
router.get("/:id", getAccountById);
router.patch("/:id", updateAccount);
router.delete("/:id", deleteAccount);

module.exports = router;
