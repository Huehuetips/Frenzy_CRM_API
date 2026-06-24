import { LeadStatus } from '@prisma/client';
import { z } from 'zod';

export const createLeadSchema = z.object({
  nameLead: z.string().min(1),
  emailLead: z.string().email(),
  phoneLead: z.string().optional(),
  sourceLead: z.string().optional()
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
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type ChangeStatusInput = z.infer<typeof changeStatusSchema>;
export type IdParamInput = z.infer<typeof idParamSchema>;
export type QueryLeadsInput = z.infer<typeof queryLeadsSchema>;
