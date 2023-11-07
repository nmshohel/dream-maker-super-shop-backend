/*
  Warnings:

  - You are about to drop the column `name` on the `products` table. All the data in the column will be lost.
  - Added the required column `title` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "name",
ADD COLUMN     "brandId" TEXT,
ADD COLUMN     "productCode" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "warrenty" TEXT;

-- CreateTable
CREATE TABLE "brand" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brand_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;
