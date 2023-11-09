-- CreateTable
CREATE TABLE "user_payament_histories" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "dueAmount" INTEGER NOT NULL DEFAULT 0,
    "paidAmount" INTEGER NOT NULL DEFAULT 0,
    "isPaid" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_payament_histories_pkey" PRIMARY KEY ("id")
);
