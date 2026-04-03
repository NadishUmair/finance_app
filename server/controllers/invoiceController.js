const { prisma } = require("../config/db");

exports.createInvoice = async (req, res) => {
  try {
    const {
      organizationId,
      createdById,
      invoiceNumber,
      clientName,
      issueDate,
      dueDate,
      subtotal,
      taxRate,
      taxAmount,
      discountAmount,
      total,
      amountPaid,
      amountDue,
      currency = "USD",
      status = "DRAFT",
      clientEmail,
      clientAddress,
      clientPhone,
      notes,
      terms,
      lineItems,
    } = req.body;

    if (!organizationId || !createdById || !invoiceNumber || !clientName || !dueDate || !total) {
      return res.status(400).json({ success: false, message: "Required invoice fields are missing" });
    }

    const invoice = await prisma.invoice.create({
      data: {
        organizationId,
        createdById,
        invoiceNumber,
        clientName,
        clientEmail,
        clientAddress,
        clientPhone,
        issueDate: issueDate ? new Date(issueDate) : new Date(),
        dueDate: new Date(dueDate),
        subtotal,
        taxRate,
        taxAmount,
        discountAmount,
        total,
        amountPaid,
        amountDue,
        currency,
        status,
        notes,
        terms,
        lineItems: lineItems
          ? {
              create: lineItems.map((item) => ({
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                amount: item.amount,
                order: item.order || 0,
              })),
            }
          : undefined,
      },
      include: { lineItems: true },
    });

    return res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    console.error("createInvoice error", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const { organizationId } = req.query;
    const where = organizationId ? { organizationId: parseInt(organizationId, 10) } : {};

    const invoices = await prisma.invoice.findMany({
      where,
      include: { lineItems: true, createdBy: true },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    console.error("getInvoices error", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await prisma.invoice.findUnique({
      where: { id: parseInt(id, 10) },
      include: { lineItems: true, createdBy: true, transactions: true },
    });

    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }

    return res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    console.error("getInvoiceById error", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    const invoice = await prisma.invoice.update({
      where: { id: parseInt(id, 10) },
      data: payload,
    });

    return res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    console.error("updateInvoice error", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.invoice.delete({ where: { id: parseInt(id, 10) } });

    return res.status(200).json({ success: true, message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("deleteInvoice error", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};
