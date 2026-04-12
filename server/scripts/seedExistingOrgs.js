import { prisma} from '../config/db.js';
import { seedCategoriesForOrg } from '../util/seedCategories.js'; // ✅ .js extension required in ESM


const orgs = await prisma.organization.findMany();
console.log(`Found ${orgs.length} organizations`);

for (const org of orgs) {
  await seedCategoriesForOrg(org.id);
}

console.log("🎉 All organizations seeded!");
await prisma.$disconnect();