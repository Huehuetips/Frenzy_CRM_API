import { LeadActivityType } from '@prisma/client';
import { z } from 'zod';

export const createActivitySchema = z.object({
  type: z.nativeEnum(LeadActivityType).default(LeadActivityType.note),
  note: z.string().min(1)
});

export const leadIdParamSchema = z.object({
  id: z.string().uuid()
});

export type CreateActivityInput = z.infer<typeof createActivitySchema>;
