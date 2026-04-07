
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