import { LeadActivityType } from '@prisma/client';
import { z } from 'zod';

export const createActivitySchema = z.object({
  type: z.literal(LeadActivityType.note).default(LeadActivityType.note),
  note: z.string().trim().min(1).max(2000)
});

export const leadIdParamSchema = z.object({
  id: z.string().uuid()
});

export type CreateActivityInput = z.infer<typeof createActivitySchema>;
