import crypto from 'crypto';
import { RequestHandler } from 'express';

import { env } from '../config/env';

export const webhookAuthMiddleware: RequestHandler = (req, res, next) => {
  const apiKey = req.header('x-api-key') ?? '';
  const secret = env.WEBHOOK_SECRET;

  if (apiKey.length !== secret.length || !crypto.timingSafeEqual(Buffer.from(apiKey), Buffer.from(secret))) {
    res.status(401).json({
      success: false,
      message: 'API Key invalida o ausente'
    });
    return;
  }

  next();
};
