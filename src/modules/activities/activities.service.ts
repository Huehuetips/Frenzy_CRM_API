import { LeadActivityType, LeadStatus } from '@prisma/client';

import { prisma } from '../../shared/prisma';
import { CreateActivityInput } from './activities.schema';

type AppError = Error & {
  statusCode?: number;
};

const createNotFoundError = () => {
  const error: AppError = new Error('Lead no encontrado');
  error.statusCode = 404;
  return error;
};

const ensureLeadExists = async (id: string) => {
  const lead = await prisma.lead.findUnique({
    where: {
      idLead: id
    }
  });

  if (!lead) {
    throw createNotFoundError();
  }

  return lead;
};

export const create = async (leadId: string, data: CreateActivityInput) => {
  await ensureLeadExists(leadId);

  return prisma.leadActivity.create({
    data: {
      leadId,
      typeLeadActivity: data.type,
      noteLeadActivity: data.note
    }
  });
};

export const findByLeadId = async (leadId: string) => {
  await ensureLeadExists(leadId);

  return prisma.leadActivity.findMany({
    where: {
      leadId
    },
    orderBy: {
      createdAtLeadActivity: 'desc'
    }
  });
};

export const createStatusChangeActivity = async (leadId: string, newStatus: LeadStatus) => {
  return prisma.leadActivity.create({
    data: {
      leadId,
      typeLeadActivity: LeadActivityType.status_change,
      noteLeadActivity: `Estado cambiado a ${newStatus}`
    }
  });
};

export const createWebhookActivity = async (leadId: string, source: string) => {
  return prisma.leadActivity.create({
    data: {
      leadId,
      typeLeadActivity: LeadActivityType.webhook,
      noteLeadActivity: `Lead ingresado desde ${source}`
    }
  });
};
