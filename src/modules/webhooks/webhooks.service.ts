import { LeadActivityType } from '@prisma/client';

import { prisma } from '../../shared/prisma';
import { WebhookLeadInput } from './webhooks.schema';

export const createLeadFromWebhook = async (data: WebhookLeadInput) => {
  return prisma.$transaction(async (tx) => {
    const lead = await tx.lead.create({
      data: {
        nameLead: data.name,
        emailLead: data.email,
        phoneLead: data.phone,
        sourceLead: data.source
      }
    });

    await tx.leadActivity.create({
      data: {
        leadId: lead.idLead,
        typeLeadActivity: LeadActivityType.webhook,
        noteLeadActivity: `Lead ingresado desde ${data.source ?? 'webhook'}`
      }
    });

    return lead;
  });
};
