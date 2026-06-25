import { Router } from 'express';

import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate, validateParams, validateQuery } from '../../middlewares/validate.middleware';
import * as leadsController from './leads.controller';
import {
  changeStatusSchema,
  createLeadSchema,
  idParamSchema,
  queryLeadsSchema,
  updateLeadSchema
} from './leads.schema';

export const leadsRoutes = Router();

leadsRoutes.use(authMiddleware);

/**
 * @openapi
 * /leads:
 *   post:
 *     summary: Crear lead
 *     tags:
 *       - Leads
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nameLead
 *               - emailLead
 *             properties:
 *               nameLead:
 *                 type: string
 *               emailLead:
 *                 type: string
 *                 format: email
 *               phoneLead:
 *                 type: string
 *               sourceLead:
 *                 type: string
 *     responses:
 *       201:
 *         description: Lead creado
 *       400:
 *         description: Error de validacion
 *       401:
 *         description: Token invalido o ausente
 */
leadsRoutes.post('/', validate(createLeadSchema), leadsController.create);

/**
 * @openapi
 * /leads:
 *   get:
 *     summary: Listar leads
 *     tags:
 *       - Leads
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [nuevo, contactado, calificado, perdido, convertido]
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Lista de leads
 *       400:
 *         description: Error de validacion
 *       401:
 *         description: Token invalido o ausente
 */
leadsRoutes.get('/', validateQuery(queryLeadsSchema), leadsController.findAll);

/**
 * @openapi
 * /leads/{id}:
 *   get:
 *     summary: Obtener lead por id
 *     tags:
 *       - Leads
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
 *         description: Lead encontrado
 *       400:
 *         description: Error de validacion
 *       401:
 *         description: Token invalido o ausente
 *       404:
 *         description: Lead no encontrado
 */
leadsRoutes.get('/:id', validateParams(idParamSchema), leadsController.findById);

/**
 * @openapi
 * /leads/{id}:
 *   patch:
 *     summary: Actualizar lead
 *     tags:
 *       - Leads
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
 *             properties:
 *               nameLead:
 *                 type: string
 *               emailLead:
 *                 type: string
 *                 format: email
 *               phoneLead:
 *                 type: string
 *               sourceLead:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lead actualizado
 *       400:
 *         description: Error de validacion
 *       401:
 *         description: Token invalido o ausente
 *       404:
 *         description: Lead no encontrado
 */
leadsRoutes.patch(
  '/:id',
  validateParams(idParamSchema),
  validate(updateLeadSchema),
  leadsController.update
);

/**
 * @openapi
 * /leads/{id}:
 *   delete:
 *     summary: Eliminar lead
 *     tags:
 *       - Leads
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
 *         description: Lead eliminado
 *       400:
 *         description: Error de validacion
 *       401:
 *         description: Token invalido o ausente
 *       404:
 *         description: Lead no encontrado
 */
leadsRoutes.delete('/:id', validateParams(idParamSchema), leadsController.remove);

/**
 * @openapi
 * /leads/{id}/status:
 *   patch:
 *     summary: Cambiar estado de lead
 *     tags:
 *       - Leads
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
 *               - statusLead
 *             properties:
 *               statusLead:
 *                 type: string
 *                 enum: [nuevo, contactado, calificado, perdido, convertido]
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       400:
 *         description: Error de validacion
 *       401:
 *         description: Token invalido o ausente
 *       404:
 *         description: Lead no encontrado
 */
leadsRoutes.patch(
  '/:id/status',
  validateParams(idParamSchema),
  validate(changeStatusSchema),
  leadsController.changeStatus
);
