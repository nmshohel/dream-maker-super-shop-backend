/*
  Warnings:

  - Added the required column `description` to the `books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount` to the `books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicationBy` to the `books` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "books" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "discount" TEXT NOT NULL,
ADD COLUMN     "publicationBy" TEXT NOT NULL,
ALTER COLUMN "price" SET DATA TYPE TEXT;
