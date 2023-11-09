/*
  Warnings:

  - Added the required column `productId` to the `ordered_books` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ordered_books" ADD COLUMN     "productId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ordered_books" ADD CONSTRAINT "ordered_books_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
