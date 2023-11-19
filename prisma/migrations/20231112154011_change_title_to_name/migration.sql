/*
  Warnings:

  - You are about to drop the column `title` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "title",
ADD COLUMN     "name" TEXT;
