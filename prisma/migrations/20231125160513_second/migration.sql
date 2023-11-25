/*
  Warnings:

  - You are about to drop the column `village` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `ordered_books` table. All the data in the column will be lost.
  - You are about to drop the column `village` on the `shipping_addresses` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `divisionId` to the `district` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "village",
ADD COLUMN     "divisionId" TEXT;

-- AlterTable
ALTER TABLE "district" ADD COLUMN     "divisionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ordered_books" DROP COLUMN "amount",
ADD COLUMN     "price" TEXT;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "contactNo" TEXT,
ADD COLUMN     "district" TEXT,
ADD COLUMN     "division" TEXT,
ADD COLUMN     "houseBuildingStreet" TEXT,
ADD COLUMN     "orderId" TEXT,
ADD COLUMN     "postOffice" TEXT,
ADD COLUMN     "thana" TEXT,
ADD COLUMN     "totalPrice" TEXT,
ADD COLUMN     "totaldiscount" TEXT;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "supplierId" TEXT;

-- AlterTable
ALTER TABLE "shipping_addresses" DROP COLUMN "village",
ADD COLUMN     "divisionId" TEXT;

-- CreateTable
CREATE TABLE "division" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "division_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "contactNo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderId_key" ON "orders"("orderId");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "division"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_addresses" ADD CONSTRAINT "shipping_addresses_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "division"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "district" ADD CONSTRAINT "district_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "division"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
