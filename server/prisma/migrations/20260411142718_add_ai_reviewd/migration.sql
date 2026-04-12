/*
  Warnings:

  - You are about to drop the column `categoryConfirmed` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "categoryConfirmed",
ADD COLUMN     "isAiReviewed" BOOLEAN NOT NULL DEFAULT false;
