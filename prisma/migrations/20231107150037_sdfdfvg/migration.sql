/*
  Warnings:

  - You are about to drop the column `category` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `subCategory` on the `products` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subCategoryId` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_category_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_subCategory_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "category",
DROP COLUMN "subCategory",
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "subCategoryId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "sub_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
