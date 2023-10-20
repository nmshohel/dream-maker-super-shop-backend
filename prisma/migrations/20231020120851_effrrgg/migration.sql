/*
  Warnings:

  - You are about to drop the column `publicationBy` on the `books` table. All the data in the column will be lost.
  - Added the required column `publication` to the `books` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "books" DROP COLUMN "publicationBy",
ADD COLUMN     "publication" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "publications" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "publications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_publication_fkey" FOREIGN KEY ("publication") REFERENCES "publications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
