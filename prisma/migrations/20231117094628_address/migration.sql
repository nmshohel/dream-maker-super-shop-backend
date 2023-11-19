/*
  Warnings:

  - You are about to drop the column `addressId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `shippingAddressId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userEmail]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userEmail]` on the table `shipping_addresses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userEmail` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userEmail` to the `shipping_addresses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "shipping_addresses" DROP CONSTRAINT "shipping_addresses_districtId_fkey";

-- DropForeignKey
ALTER TABLE "shipping_addresses" DROP CONSTRAINT "shipping_addresses_postOfficeId_fkey";

-- DropForeignKey
ALTER TABLE "shipping_addresses" DROP CONSTRAINT "shipping_addresses_thanaId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_addressId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_shippingAddressId_fkey";

-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "userEmail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "shipping_addresses" ADD COLUMN     "userEmail" TEXT NOT NULL,
ALTER COLUMN "postOfficeId" DROP NOT NULL,
ALTER COLUMN "thanaId" DROP NOT NULL,
ALTER COLUMN "districtId" DROP NOT NULL,
ALTER COLUMN "houseBuildingStreet" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "addressId",
DROP COLUMN "shippingAddressId";

-- CreateIndex
CREATE UNIQUE INDEX "addresses_userEmail_key" ON "addresses"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "shipping_addresses_userEmail_key" ON "shipping_addresses"("userEmail");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_addresses" ADD CONSTRAINT "shipping_addresses_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_addresses" ADD CONSTRAINT "shipping_addresses_postOfficeId_fkey" FOREIGN KEY ("postOfficeId") REFERENCES "post_offices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_addresses" ADD CONSTRAINT "shipping_addresses_thanaId_fkey" FOREIGN KEY ("thanaId") REFERENCES "thana"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_addresses" ADD CONSTRAINT "shipping_addresses_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "district"("id") ON DELETE SET NULL ON UPDATE CASCADE;
