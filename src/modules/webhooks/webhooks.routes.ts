import { Router } from 'express';

import { webhookAuthMiddleware } from '../../middlewares/webhook.middleware';
import { validate } from '../../middlewares/validate.middleware';
import * as webhooksController from './webhooks.controller';
import { webhookLeadSchema } from './webhooks.schema';

export const webhooksRoutes = Router();

webhooksRoutes.use(webhookAuthMiddleware);

/**
 * @openapi
 * /webhooks/leads:
 *   post:
 *     summary: Crear lead desde webhook
 *     tags:
 *       - Webhooks
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               source:
 *                 type: string
 *     responses:
 *       201:
 *         description: Lead creado desde webhook
 *       400:
 *         description: Error de validacion
 *       401:
 *         description: API Key invalida o ausente
 */
webhooksRoutes.post('/leads', validate(webhookLeadSchema), webhooksController.createLead);
