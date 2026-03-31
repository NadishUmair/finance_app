require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Please set it in server/.env");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString,
  }),
});

prisma
  .$connect()
  .then(() => console.log("Prisma connected to database."))
  .catch((err) => {
    console.error("Prisma connection failed:", err);
    process.exit(1);
  });

prisma.$on("error", (err) => {
  console.error("Prisma error:", err);
});

module.exports = { prisma };