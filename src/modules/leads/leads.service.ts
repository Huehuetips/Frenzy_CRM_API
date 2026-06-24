import { LeadStatus, Prisma } from '@prisma/client';

import { prisma } from '../../shared/prisma';
import { CreateLeadInput, QueryLeadsInput, UpdateLeadInput } from './leads.schema';

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

export const create = async (data: CreateLeadInput) => {
  return prisma.lead.create({
    data
  });
};

export const findAll = async (filters: QueryLeadsInput) => {
  const { email, status, source, from, to, page, limit } = filters;
  const where: Prisma.LeadWhereInput = {};

  if (email) {
    where.emailLead = {
      contains: email,
      mode: 'insensitive'
    };
  }

  if (status) {
    where.statusLead = status;
  }

  if (source) {
    where.sourceLead = source;
  }

  if (from || to) {
    where.createdAtLead = {
      ...(from && { gte: new Date(from) }),
      ...(to && { lte: new Date(to) })
    };
  }

  const skip = (page - 1) * limit;

  const [leads, total] = await prisma.$transaction([
    prisma.lead.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAtLead: 'desc'
      }
    }),
    prisma.lead.count({ where })
  ]);

  return {
    data: leads,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const findById = async (id: string) => {
  return ensureLeadExists(id);
};

export const update = async (id: string, data: UpdateLeadInput) => {
  await ensureLeadExists(id);

  return prisma.lead.update({
    where: {
      idLead: id
    },
    data
  });
};

export const remove = async (id: string) => {
  await ensureLeadExists(id);

  return prisma.lead.delete({
    where: {
      idLead: id
    }
  });
};

export const changeStatus = async (id: string, status: LeadStatus) => {
  await ensureLeadExists(id);

  return prisma.lead.update({
    where: {
      idLead: id
    },
    data: {
      statusLead: status
    }
  });
};
