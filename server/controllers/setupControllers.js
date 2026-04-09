
const e = require("express");
const { prisma } = require("../config/db");

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const organizationId = req.user.organizationId; // ✅ from token
        console.log("Organization ID from token:", organizationId);

        // ✅ Check org exists
        const findOrg = await prisma.organization.findUnique({
            where: { id: organizationId }
        });

        if (!findOrg) {
            return res.status(404).json({ message: "Organization not found" });
        }

        // ✅ Create category
        const newCategory = await prisma.category.create({
            data: {
                name,
                organizationId,
            }
        });

        res.status(201).json({ 
            message: "Category created successfully", 
            category: newCategory 
        });

    } catch (error) {
        console.error("Error creating category", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

exports.editCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const { categoryId } = req.params;
        const organizationId = req.user.organizationId; // ✅ from token
        console.log("Organization ID from token:", organizationId);
        // ✅ Check org exists
        const findOrg = await prisma.organization.findUnique({
            where: { id: organizationId }
        }); 
        if (!findOrg) {
            return res.status(404).json({ message: "Organization not found" });
        }
        // ✅ Check category exists
        const findCategory = await prisma.category.findUnique({
            where: { id: parseInt(categoryId) }
        });
        if (!findCategory || findCategory.organizationId !== organizationId) {
            return res.status(404).json({ message: "Category not found" });
        }
        // ✅ Update category
        const updatedCategory = await prisma.category.update({
            where: { id: parseInt(categoryId) },
            data: { name }
        });
        res.status(200).json({ 
            message: "Category updated successfully", 
            category: updatedCategory 
        });
    } catch (error) {
        console.error("Error updating category", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;  
        const organizationId = req.user.organizationId;

        // ✅ Check org exists
        const findOrg = await prisma.organization.findUnique({
            where: { id: organizationId }
        });
        if (!findOrg) {
            return res.status(404).json({ message: "Organization not found" });
        }

        // ✅ Check category exists and belongs to org
        const findCategory = await prisma.category.findUnique({
            where: { id: parseInt(categoryId) }
        });
        if (!findCategory || findCategory.organizationId !== organizationId) {
            return res.status(404).json({ message: "Category not found" });
        }

        // ✅ Check if transactions exist in this category
        const transactionCount = await prisma.transaction.count({
            where: { categoryId: parseInt(categoryId) }
        });
        if (transactionCount > 0) {
            return res.status(400).json({ 
                message: `Cannot delete category. It has ${transactionCount} transaction(s) linked to it.` 
            });
        }

        // ✅ Safe to delete
        await prisma.category.delete({
            where: { id: parseInt(categoryId) }
        });

        res.status(200).json({ message: "Category deleted successfully" });

    } catch (error) {
        console.error("Error deleting category", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


exports.getCategories = async (req, res) => {
    try {
        const organizationId = req.params.organizationId || req.user.organizationId; // ✅ from token
        console.log("Organization ID from token:", organizationId);
        // ✅ Check org exists
        const findOrg = await prisma.organization.findUnique({
            where: { id: organizationId }
        }); 
        if (!findOrg) {
            return res.status(404).json({ message: "Organization not found" });
        }
        // ✅ Get categories
        const categories = await prisma.category.findMany({
            where: { organizationId }
        });     
        res.status(200).json({ 
            message: "Categories retrieved successfully", 
            categories 
        });
    } catch (error) {
        console.error("Error retrieving categories", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

exports.creatAccount = async (req, res) => {
    try {
        const { name, type } = req.body; 
        const organizationId = req.user.organizationId; // ✅ from token
        console.log("Organization ID from token:", organizationId);
        // ✅ Check org exists
        const findOrg = await prisma.organization.findUnique({
            where: { id: organizationId }
        });
        if (!findOrg) {
            return res.status(404).json({ message: "Organization not found" });
        }
        // ✅ Create account
        const newAccount = await prisma.account.create({
            data: { name, type,
                 organizationId }
        });
        res.status(201).json({  
            message: "Account created successfully", 
            account: newAccount 
        });
    } catch (error) {
        console.error("Error creating account", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

exports.getAccounts = async (req, res) => {
    try {
        const organizationId = req.params.organizationId || req.user.organizationId; // ✅ from token           
        console.log("Organization ID from token:", organizationId);
        // ✅ Check org exists
        const findOrg = await prisma.organization.findUnique({      
            where: { id: organizationId }
        });
        if (!findOrg) {
            return res.status(404).json({ message: "Organization not found" });
        }
        // ✅ Get accounts
        const accounts = await prisma.account.findMany({
            where: { organizationId }
        });
        res.status(200).json({ 
            message: "Accounts retrieved successfully", 
            accounts 
        });
    } catch (error) {
        console.error("Error retrieving accounts", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }   
}


exports.editAccount = async (req, res) => {
    try {
        const { name, type } = req.body;
        const { accountId } = req.params;
        const organizationId = req.user.organizationId; // ✅ from token
        console.log("Organization ID from token:", organizationId);
        // ✅ Check org exists
        const findOrg = await prisma.organization.findUnique({
            where: { id: organizationId }
        });
        if (!findOrg) {
            return res.status(404).json({ message: "Organization not found" });
        }
        // ✅ Check account exists
        const findAccount = await prisma.account.findUnique({
            where: { id: parseInt(accountId) }
        });
        if (!findAccount || findAccount.organizationId !== organizationId) {
            return res.status(404).json({ message: "Account not found" });
        }
        // ✅ Update account
        const updatedAccount = await prisma.account.update({
            where: { id: parseInt(accountId) },
            data: { name, type }
        });
        res.status(200).json({ 
            message: "Account updated successfully", 
            account: updatedAccount 
        });
    } catch (error) {
        console.error("Error updating account", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

exports.deleteAccount = async (req, res) => {   
    try {
        const { accountId } = req.params;
        const organizationId = req.user.organizationId;

        // ✅ Check org exists
        const findOrg = await prisma.organization.findUnique({
            where: { id: organizationId }
        });
        if (!findOrg) {
            return res.status(404).json({ message: "Organization not found" });
        }   
         
        // ✅ Check account exists and belongs to org
        const findAccount = await prisma.account.findUnique({
            where: { id: parseInt(accountId) }
        });
        if (!findAccount || findAccount.organizationId !== organizationId) {
            return res.status(404).json({ message: "Account not found" });
        }

        // ✅ Check if transactions exist on this account
        const transactionCount = await prisma.transaction.count({
            where: {
                OR: [
                    { fromAccountId: parseInt(accountId) },
                    { toAccountId: parseInt(accountId) }
                ]
            }
        });
        if (transactionCount > 0) {
            return res.status(400).json({ 
                message: `Cannot delete account. It has ${transactionCount} transaction(s) linked to it.` 
            });
        }

        // ✅ Safe to delete
        await prisma.account.delete({
            where: { id: parseInt(accountId) }
        });

        res.status(200).json({ message: "Account deleted successfully" });

    } catch (error) {
        console.error("Error deleting account", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}