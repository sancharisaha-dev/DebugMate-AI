-- CreateTable
CREATE TABLE "AIAnalysis" (
    "id" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "rootCause" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "promptTokens" INTEGER,
    "completionTokens" INTEGER,
    "totalTokens" INTEGER,
    "processingTimeMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "errorReportId" TEXT NOT NULL,

    CONSTRAINT "AIAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AIAnalysis_errorReportId_idx" ON "AIAnalysis"("errorReportId");

-- AddForeignKey
ALTER TABLE "AIAnalysis" ADD CONSTRAINT "AIAnalysis_errorReportId_fkey" FOREIGN KEY ("errorReportId") REFERENCES "ErrorReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
