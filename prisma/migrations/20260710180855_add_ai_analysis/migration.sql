-- CreateIndex
CREATE INDEX "AIAnalysis_provider_idx" ON "AIAnalysis"("provider");

-- CreateIndex
CREATE INDEX "ErrorReport_fingerprint_idx" ON "ErrorReport"("fingerprint");

-- CreateIndex
CREATE INDEX "ErrorReport_status_idx" ON "ErrorReport"("status");

-- CreateIndex
CREATE INDEX "ErrorReport_severity_idx" ON "ErrorReport"("severity");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");
