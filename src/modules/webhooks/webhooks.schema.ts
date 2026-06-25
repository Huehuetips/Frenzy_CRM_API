import { z } from 'zod';

export const webhookLeadSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().regex(/^\+?[\d\s\-()]+$/, 'Formato de telefono invalido').max(20).optional(),
  source: z.string().trim().toLowerCase().max(50).optional()
});

export type WebhookLeadInput = z.infer<typeof webhookLeadSchema>;
