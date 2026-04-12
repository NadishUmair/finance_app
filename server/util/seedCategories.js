import { prisma } from '../config/db.js';

const DEFAULT_CATEGORIES = [
  { name: "Food & Dining",   icon: "🍔", color: "#F97316" },
  { name: "Transport",       icon: "🚗", color: "#3B82F6" },
  { name: "Groceries",       icon: "🛒", color: "#22C55E" },
  { name: "Utilities",       icon: "💡", color: "#EAB308" },
  { name: "Rent",            icon: "🏠", color: "#8B5CF6" },
  { name: "Shopping",        icon: "🛍️", color: "#EC4899" },
  { name: "Healthcare",      icon: "🏥", color: "#EF4444" },
  { name: "Education",       icon: "📚", color: "#06B6D4" },
  { name: "Entertainment",   icon: "🎬", color: "#F59E0B" },
  { name: "Subscriptions",   icon: "🔄", color: "#6366F1" },
  { name: "Taxes",           icon: "🏛️", color: "#DC2626" },
  { name: "Insurance",       icon: "🛡️", color: "#0891B2" },
  { name: "Travel",          icon: "✈️", color: "#7C3AED" },
  { name: "Cash Withdrawal", icon: "💵", color: "#374151" },
  { name: "Bank Fees",       icon: "🏦", color: "#9CA3AF" },
  { name: "Salary",          icon: "💰", color: "#10B981" },
  { name: "Freelance",       icon: "💻", color: "#0EA5E9" },
  { name: "Refund",          icon: "↩️", color: "#84CC16" },
  { name: "Investment",      icon: "📈", color: "#F59E0B" },
  { name: "Business Income", icon: "💼", color: "#6366F1" },
  { name: "Other",           icon: "📦", color: "#6B7280" },
];

export async function seedCategoriesForOrg(organizationId) {  // ✅ export here
  console.log(`🌱 Seeding categories for org ${organizationId}...`);
  for (const cat of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { organizationId_name: { organizationId, name: cat.name } },
      update: {},
      create: { ...cat, organizationId, isDefault: true },
    });
  }
  console.log(`✅ Categories seeded for org ${organizationId}`);
}

