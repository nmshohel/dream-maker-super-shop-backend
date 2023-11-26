/*
  Warnings:

  - You are about to drop the `ordered_books` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ordered_books" DROP CONSTRAINT "ordered_books_orderId_fkey";

-- DropForeignKey
ALTER TABLE "ordered_books" DROP CONSTRAINT "ordered_books_productId_fkey";

-- DropTable
DROP TABLE "ordered_books";

-- CreateTable
CREATE TABLE "ordered_products" (
    "id" TEXT NOT NULL,
    "price" TEXT,
    "discount" TEXT,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ordered_products_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ordered_products" ADD CONSTRAINT "ordered_products_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordered_products" ADD CONSTRAINT "ordered_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
