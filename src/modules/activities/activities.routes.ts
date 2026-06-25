import { Router } from 'express';

import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate, validateParams } from '../../middlewares/validate.middleware';
import * as activitiesController from './activities.controller';
import { createActivitySchema, leadIdParamSchema } from './activities.schema';

export const activitiesRoutes = Router({ mergeParams: true });

activitiesRoutes.use(authMiddleware);

/**
 * @openapi
 * /leads/{id}/activities:
 *   post:
 *     summary: Crear actividad de lead
 *     tags:
 *       - Actividades
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - note
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [note]
 *                 description: Solo acepta 'note'. Los tipos status_change y webhook los genera el sistema internamente.
 *                 default: note
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Actividad creada
 *       400:
 *         description: Error de validacion
 *       401:
 *         description: Token invalido o ausente
 *       404:
 *         description: Lead no encontrado
 */
activitiesRoutes.post(
  '/',
  validateParams(leadIdParamSchema),
  validate(createActivitySchema),
  activitiesController.create
);

/**
 * @openapi
 * /leads/{id}/activities:
 *   get:
 *     summary: Listar actividades de lead
 *     tags:
 *       - Actividades
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lista de actividades
 *       400:
 *         description: Error de validacion
 *       401:
 *         description: Token invalido o ausente
 *       404:
 *         description: Lead no encontrado
 */
activitiesRoutes.get('/', validateParams(leadIdParamSchema), activitiesController.findByLeadId);
