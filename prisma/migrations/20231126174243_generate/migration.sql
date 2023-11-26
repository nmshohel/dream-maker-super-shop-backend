/*
  Warnings:

  - You are about to drop the column `district` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `division` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `thana` on the `orders` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "orders_orderId_key";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "district",
DROP COLUMN "division",
DROP COLUMN "thana",
ADD COLUMN     "districtId" TEXT,
ADD COLUMN     "divisionId" TEXT,
ADD COLUMN     "thanaId" TEXT;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "division"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "district"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_thanaId_fkey" FOREIGN KEY ("thanaId") REFERENCES "thana"("id") ON DELETE SET NULL ON UPDATE CASCADE;
