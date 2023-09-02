/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `complainCode` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `mobileNo` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `pbsCode` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `substationCode` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `zonalCode` on the `users` table. All the data in the column will be lost.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `brands` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `capital_item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `complain_center` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `departments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `designations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `employees` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `item_type` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `models` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pbs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `revenue_item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sub_category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `substations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `suppliers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `zonals` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactNo` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `users` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileImg` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'customer');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'shipped', 'delivered');

-- DropForeignKey
ALTER TABLE "capital_item" DROP CONSTRAINT "capital_item_addByMobileNo_fkey";

-- DropForeignKey
ALTER TABLE "capital_item" DROP CONSTRAINT "capital_item_approveByMobleNo_fkey";

-- DropForeignKey
ALTER TABLE "capital_item" DROP CONSTRAINT "capital_item_assignToMobileNo_fkey";

-- DropForeignKey
ALTER TABLE "capital_item" DROP CONSTRAINT "capital_item_brandId_fkey";

-- DropForeignKey
ALTER TABLE "capital_item" DROP CONSTRAINT "capital_item_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "capital_item" DROP CONSTRAINT "capital_item_complainCode_fkey";

-- DropForeignKey
ALTER TABLE "capital_item" DROP CONSTRAINT "capital_item_issueByMobileNo_fkey";

-- DropForeignKey
ALTER TABLE "capital_item" DROP CONSTRAINT "capital_item_itemTypeId_fkey";

-- DropForeignKey
ALTER TABLE "capital_item" DROP CONSTRAINT "capital_item_modelId_fkey";

-- DropForeignKey
ALTER TABLE "capital_item" DROP CONSTRAINT "capital_item_pbsCode_fkey";

-- DropForeignKey
ALTER TABLE "capital_item" DROP CONSTRAINT "capital_item_receivedByMobileNo_fkey";

-- DropForeignKey
ALTER TABLE "capital_item" DROP CONSTRAINT "capital_item_subCategoryid_fkey";

-- DropForeignKey
ALTER TABLE "capital_item" DROP CONSTRAINT "capital_item_substationCode_fkey";

-- DropForeignKey
ALTER TABLE "capital_item" DROP CONSTRAINT "capital_item_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "capital_item" DROP CONSTRAINT "capital_item_zonalCode_fkey";

-- DropForeignKey
ALTER TABLE "category" DROP CONSTRAINT "category_itemTypeId_fkey";

-- DropForeignKey
ALTER TABLE "complain_center" DROP CONSTRAINT "complain_center_pbsCode_fkey";

-- DropForeignKey
ALTER TABLE "complain_center" DROP CONSTRAINT "complain_center_zonalCode_fkey";

-- DropForeignKey
ALTER TABLE "designations" DROP CONSTRAINT "designations_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_mobileNo_fkey";

-- DropForeignKey
ALTER TABLE "models" DROP CONSTRAINT "models_brandId_fkey";

-- DropForeignKey
ALTER TABLE "revenue_item" DROP CONSTRAINT "revenue_item_addByMobileNo_fkey";

-- DropForeignKey
ALTER TABLE "revenue_item" DROP CONSTRAINT "revenue_item_approveByMobleNo_fkey";

-- DropForeignKey
ALTER TABLE "revenue_item" DROP CONSTRAINT "revenue_item_assignToMobileNo_fkey";

-- DropForeignKey
ALTER TABLE "revenue_item" DROP CONSTRAINT "revenue_item_brandId_fkey";

-- DropForeignKey
ALTER TABLE "revenue_item" DROP CONSTRAINT "revenue_item_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "revenue_item" DROP CONSTRAINT "revenue_item_complainCode_fkey";

-- DropForeignKey
ALTER TABLE "revenue_item" DROP CONSTRAINT "revenue_item_identificationNo_fkey";

-- DropForeignKey
ALTER TABLE "revenue_item" DROP CONSTRAINT "revenue_item_issueByMobileNo_fkey";

-- DropForeignKey
ALTER TABLE "revenue_item" DROP CONSTRAINT "revenue_item_itemTypeId_fkey";

-- DropForeignKey
ALTER TABLE "revenue_item" DROP CONSTRAINT "revenue_item_modelId_fkey";

-- DropForeignKey
ALTER TABLE "revenue_item" DROP CONSTRAINT "revenue_item_pbsCode_fkey";

-- DropForeignKey
ALTER TABLE "revenue_item" DROP CONSTRAINT "revenue_item_receivedByMobileNo_fkey";

-- DropForeignKey
ALTER TABLE "revenue_item" DROP CONSTRAINT "revenue_item_subCategoryid_fkey";

-- DropForeignKey
ALTER TABLE "revenue_item" DROP CONSTRAINT "revenue_item_substationCode_fkey";

-- DropForeignKey
ALTER TABLE "revenue_item" DROP CONSTRAINT "revenue_item_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "revenue_item" DROP CONSTRAINT "revenue_item_zonalCode_fkey";

-- DropForeignKey
ALTER TABLE "sub_category" DROP CONSTRAINT "sub_category_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "substations" DROP CONSTRAINT "substations_pbsCode_fkey";

-- DropForeignKey
ALTER TABLE "substations" DROP CONSTRAINT "substations_zonalCode_fkey";

-- DropForeignKey
ALTER TABLE "suppliers" DROP CONSTRAINT "suppliers_pbsCode_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_complainCode_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_pbsCode_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_substationCode_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_zonalCode_fkey";

-- DropForeignKey
ALTER TABLE "zonals" DROP CONSTRAINT "zonals_pbsCode_fkey";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "complainCode",
DROP COLUMN "mobileNo",
DROP COLUMN "pbsCode",
DROP COLUMN "substationCode",
DROP COLUMN "zonalCode",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "contactNo" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "profileImg" TEXT NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole",
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "brands";

-- DropTable
DROP TABLE "capital_item";

-- DropTable
DROP TABLE "category";

-- DropTable
DROP TABLE "complain_center";

-- DropTable
DROP TABLE "departments";

-- DropTable
DROP TABLE "designations";

-- DropTable
DROP TABLE "employees";

-- DropTable
DROP TABLE "item_type";

-- DropTable
DROP TABLE "models";

-- DropTable
DROP TABLE "pbs";

-- DropTable
DROP TABLE "revenue_item";

-- DropTable
DROP TABLE "sub_category";

-- DropTable
DROP TABLE "substations";

-- DropTable
DROP TABLE "suppliers";

-- DropTable
DROP TABLE "zonals";

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "books" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "genre" TEXT NOT NULL,
    "publicationDate" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_rating" (
    "id" TEXT NOT NULL,
    "review" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "review_rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderedBooks" JSONB NOT NULL,
    "status" "Status",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_rating" ADD CONSTRAINT "review_rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_rating" ADD CONSTRAINT "review_rating_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
