/*
  Warnings:

  - You are about to drop the column `isAiReviewed` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "isAiReviewed",
ADD COLUMN     "categoryConfirmed" BOOLEAN NOT NULL DEFAULT false;
