-- CreateTable
CREATE TABLE "genres" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_genre_fkey" FOREIGN KEY ("genre") REFERENCES "genres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
