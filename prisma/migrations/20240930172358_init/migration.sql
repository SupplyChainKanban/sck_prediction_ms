-- CreateEnum
CREATE TYPE "PredictionStatus" AS ENUM ('BACKLOG', 'TO_BUY', 'IN_BUYING_PROCESS', 'BOUGHT', 'DISMISSED');

-- CreateTable
CREATE TABLE "Prediction" (
    "id" TEXT NOT NULL,
    "materialID" TEXT NOT NULL,
    "predictedQuantity" INTEGER NOT NULL,
    "predictedDays" INTEGER NOT NULL,
    "predictedDate" TIMESTAMP(3) NOT NULL,
    "dataAnalyticsId" TEXT NOT NULL,
    "status" "PredictionStatus" NOT NULL DEFAULT 'BACKLOG',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prediction_pkey" PRIMARY KEY ("id")
);
