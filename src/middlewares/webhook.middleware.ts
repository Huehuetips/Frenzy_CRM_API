import { RequestHandler } from 'express';

import { env } from '../config/env';

export const webhookAuthMiddleware: RequestHandler = (req, res, next) => {
  const apiKey = req.header('x-api-key');

  if (apiKey !== env.WEBHOOK_SECRET) {
    res.status(401).json({
      success: false,
      message: 'API Key invalida o ausente'
    });
    return;
  }

  next();
};
