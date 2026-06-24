-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('nuevo', 'contactado', 'calificado', 'perdido', 'convertido');

-- CreateEnum
CREATE TYPE "LeadActivityType" AS ENUM ('note', 'status_change', 'webhook');

-- CreateTable
CREATE TABLE "users" (
    "idUser" TEXT NOT NULL,
    "emailUser" TEXT NOT NULL,
    "passwordHashUser" TEXT NOT NULL,
    "createdAtUser" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAtUser" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("idUser")
);

-- CreateTable
CREATE TABLE "leads" (
    "idLead" TEXT NOT NULL,
    "nameLead" TEXT NOT NULL,
    "emailLead" TEXT NOT NULL,
    "phoneLead" TEXT,
    "sourceLead" TEXT,
    "statusLead" "LeadStatus" NOT NULL DEFAULT 'nuevo',
    "createdAtLead" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAtLead" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("idLead")
);

-- CreateTable
CREATE TABLE "lead_activities" (
    "idLeadActivity" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "typeLeadActivity" "LeadActivityType" NOT NULL DEFAULT 'note',
    "noteLeadActivity" TEXT NOT NULL,
    "createdAtLeadActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_activities_pkey" PRIMARY KEY ("idLeadActivity")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_emailUser_key" ON "users"("emailUser");

-- CreateIndex
CREATE INDEX "leads_emailLead_idx" ON "leads"("emailLead");

-- CreateIndex
CREATE INDEX "leads_statusLead_idx" ON "leads"("statusLead");

-- CreateIndex
CREATE INDEX "leads_sourceLead_idx" ON "leads"("sourceLead");

-- CreateIndex
CREATE INDEX "leads_createdAtLead_idx" ON "leads"("createdAtLead");

-- CreateIndex
CREATE INDEX "lead_activities_leadId_idx" ON "lead_activities"("leadId");

-- CreateIndex
CREATE INDEX "lead_activities_createdAtLeadActivity_idx" ON "lead_activities"("createdAtLeadActivity");

-- AddForeignKey
ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("idLead") ON DELETE CASCADE ON UPDATE CASCADE;
