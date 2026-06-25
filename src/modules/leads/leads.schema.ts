import { LeadStatus } from '@prisma/client';
import { z } from 'zod';

export const createLeadSchema = z.object({
  nameLead: z.string().trim().min(1).max(100),
  emailLead: z.string().trim().email().max(255),
  phoneLead: z.string().trim().regex(/^\+?[\d\s\-()]+$/, 'Formato de telefono invalido').max(20).optional(),
  sourceLead: z.string().trim().toLowerCase().max(50).optional()
});

export const updateLeadSchema = createLeadSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: 'At least one field is required'
  }
);

export const changeStatusSchema = z.object({
  statusLead: z.nativeEnum(LeadStatus)
});

export const idParamSchema = z.object({
  id: z.string().uuid()
});

export const queryLeadsSchema = z.object({
  email: z.string().optional(),
  status: z.nativeEnum(LeadStatus).optional(),
  source: z.string().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20)
}).refine(
  (data) => {
    if (data.from && data.to) {
      return new Date(data.from) <= new Date(data.to);
    }

    return true;
  },
  { message: 'La fecha from debe ser anterior o igual a to', path: ['from'] }
);

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type ChangeStatusInput = z.infer<typeof changeStatusSchema>;
export type IdParamInput = z.infer<typeof idParamSchema>;
export type QueryLeadsInput = z.infer<typeof queryLeadsSchema>;
