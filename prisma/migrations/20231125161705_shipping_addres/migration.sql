/*
  Warnings:

  - You are about to drop the column `postOfficeId` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `postOffice` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `postOfficeId` on the `shipping_addresses` table. All the data in the column will be lost.
  - You are about to drop the `post_offices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_postOfficeId_fkey";

-- DropForeignKey
ALTER TABLE "post_offices" DROP CONSTRAINT "post_offices_thanaId_fkey";

-- DropForeignKey
ALTER TABLE "shipping_addresses" DROP CONSTRAINT "shipping_addresses_postOfficeId_fkey";

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "postOfficeId",
ADD COLUMN     "postCode" TEXT;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "postOffice",
ADD COLUMN     "name" TEXT,
ADD COLUMN     "postCode" TEXT;

-- AlterTable
ALTER TABLE "shipping_addresses" DROP COLUMN "postOfficeId",
ADD COLUMN     "postCode" TEXT;

-- DropTable
DROP TABLE "post_offices";
