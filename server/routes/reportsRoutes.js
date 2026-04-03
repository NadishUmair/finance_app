const express = require("express");
const router = express.Router();
const { getOrganizationSummary, getInvoiceAgingReport } = require("../controllers/reportController");

router.get("/summary", getOrganizationSummary);
router.get("/invoice-aging", getInvoiceAgingReport);

module.exports = router;
