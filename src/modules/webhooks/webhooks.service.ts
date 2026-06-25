import { prisma } from '../../shared/prisma';
import { createWebhookActivity } from '../activities/activities.service';
import { WebhookLeadInput } from './webhooks.schema';

export const createLeadFromWebhook = async (data: WebhookLeadInput) => {
  const lead = await prisma.lead.create({
    data: {
      nameLead: data.name,
      emailLead: data.email,
      phoneLead: data.phone,
      sourceLead: data.source
    }
  });

  await createWebhookActivity(lead.idLead, data.source ?? 'webhook');

  return lead;
};
