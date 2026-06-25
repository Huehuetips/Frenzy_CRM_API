import { createAppError } from '../../shared/errors';
import { prisma } from '../../shared/prisma';
import { CreateActivityInput } from './activities.schema';

const ensureLeadExists = async (id: string) => {
  const lead = await prisma.lead.findUnique({
    where: {
      idLead: id
    }
  });

  if (!lead) {
    throw createAppError('Lead no encontrado', 404);
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
