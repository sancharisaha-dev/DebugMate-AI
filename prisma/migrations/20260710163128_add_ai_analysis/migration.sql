/*
  Warnings:

  - You are about to drop the column `completionTokens` on the `AIAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `processingTimeMs` on the `AIAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `promptTokens` on the `AIAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `solution` on the `AIAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `totalTokens` on the `AIAnalysis` table. All the data in the column will be lost.
  - You are about to alter the column `confidence` on the `AIAnalysis` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - A unique constraint covering the columns `[errorReportId]` on the table `AIAnalysis` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `explanation` to the `AIAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fixes` to the `AIAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prevention` to the `AIAnalysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `severity` to the `AIAnalysis` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "AIAnalysis_errorReportId_idx";

-- AlterTable
ALTER TABLE "AIAnalysis" DROP COLUMN "completionTokens",
DROP COLUMN "processingTimeMs",
DROP COLUMN "promptTokens",
DROP COLUMN "solution",
DROP COLUMN "totalTokens",
ADD COLUMN     "explanation" TEXT NOT NULL,
ADD COLUMN     "fixes" JSONB NOT NULL,
ADD COLUMN     "prevention" JSONB NOT NULL,
ADD COLUMN     "severity" "Severity" NOT NULL,
ALTER COLUMN "confidence" SET DATA TYPE INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "AIAnalysis_errorReportId_key" ON "AIAnalysis"("errorReportId");
