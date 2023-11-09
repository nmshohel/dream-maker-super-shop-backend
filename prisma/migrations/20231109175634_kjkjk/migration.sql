-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_userEmail_fkey";

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "userEmail" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "users"("email") ON DELETE SET NULL ON UPDATE CASCADE;
