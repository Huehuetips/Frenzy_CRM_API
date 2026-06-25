import { RequestHandler } from 'express';

import { WebhookLeadInput } from './webhooks.schema';
import * as webhooksService from './webhooks.service';

export const createLead: RequestHandler = async (req, res, next) => {
  try {
    const lead = await webhooksService.createLeadFromWebhook(req.body as WebhookLeadInput);

    res.status(201).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};
