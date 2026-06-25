import { z } from 'zod';

export const webhookLeadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  source: z.string().optional()
});

export type WebhookLeadInput = z.infer<typeof webhookLeadSchema>;
