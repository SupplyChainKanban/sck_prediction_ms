/*
  Warnings:

  - The values [BACKLOG,TO_BUY,IN_BUYING_PROCESS,BOUGHT,DISMISSED] on the enum `PredictionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PredictionStatus_new" AS ENUM ('PENDING', 'CREATION_DONE', 'UPDATED_DONE', 'PROCESS_DONE', 'ERROR');
ALTER TABLE "Prediction" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Prediction" ALTER COLUMN "status" TYPE "PredictionStatus_new" USING ("status"::text::"PredictionStatus_new");
ALTER TYPE "PredictionStatus" RENAME TO "PredictionStatus_old";
ALTER TYPE "PredictionStatus_new" RENAME TO "PredictionStatus";
DROP TYPE "PredictionStatus_old";
ALTER TABLE "Prediction" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "Prediction" ALTER COLUMN "status" SET DEFAULT 'PENDING';
