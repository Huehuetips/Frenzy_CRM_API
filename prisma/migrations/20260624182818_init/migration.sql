-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('nuevo', 'contactado', 'calificado', 'perdido', 'convertido');

-- CreateEnum
CREATE TYPE "LeadActivityType" AS ENUM ('note', 'status_change', 'webhook');

-- CreateTable
CREATE TABLE "Users" (
    "idUser" TEXT NOT NULL,
    "emailUser" TEXT NOT NULL,
    "passwordHashUser" TEXT NOT NULL,
    "createdAtUser" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAtUser" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("idUser")
);

-- CreateTable
CREATE TABLE "Leads" (
    "idLead" TEXT NOT NULL,
    "nameLead" TEXT NOT NULL,
    "emailLead" TEXT NOT NULL,
    "phoneLead" TEXT,
    "sourceLead" TEXT,
    "statusLead" "LeadStatus" NOT NULL DEFAULT 'nuevo',
    "createdAtLead" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAtLead" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Leads_pkey" PRIMARY KEY ("idLead")
);

-- CreateTable
CREATE TABLE "LeadActivities" (
    "idLeadActivity" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "typeLeadActivity" "LeadActivityType" NOT NULL DEFAULT 'note',
    "noteLeadActivity" TEXT NOT NULL,
    "createdAtLeadActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadActivities_pkey" PRIMARY KEY ("idLeadActivity")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_emailUser_key" ON "Users"("emailUser");

-- CreateIndex
CREATE INDEX "Leads_emailLead_idx" ON "Leads"("emailLead");

-- CreateIndex
CREATE INDEX "Leads_statusLead_idx" ON "Leads"("statusLead");

-- CreateIndex
CREATE INDEX "Leads_sourceLead_idx" ON "Leads"("sourceLead");

-- CreateIndex
CREATE INDEX "Leads_createdAtLead_idx" ON "Leads"("createdAtLead");

-- CreateIndex
CREATE INDEX "LeadActivities_leadId_idx" ON "LeadActivities"("leadId");

-- CreateIndex
CREATE INDEX "LeadActivities_createdAtLeadActivity_idx" ON "LeadActivities"("createdAtLeadActivity");

-- AddForeignKey
ALTER TABLE "LeadActivities" ADD CONSTRAINT "LeadActivities_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Leads"("idLead") ON DELETE CASCADE ON UPDATE CASCADE;
