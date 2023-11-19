-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_districtId_fkey";

-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_postOfficeId_fkey";

-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_thanaId_fkey";

-- AlterTable
ALTER TABLE "addresses" ALTER COLUMN "postOfficeId" DROP NOT NULL,
ALTER COLUMN "thanaId" DROP NOT NULL,
ALTER COLUMN "districtId" DROP NOT NULL,
ALTER COLUMN "houseBuildingStreet" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_postOfficeId_fkey" FOREIGN KEY ("postOfficeId") REFERENCES "post_offices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_thanaId_fkey" FOREIGN KEY ("thanaId") REFERENCES "thana"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "district"("id") ON DELETE SET NULL ON UPDATE CASCADE;
