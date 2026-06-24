import { Router } from 'express';

import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import * as authController from './auth.controller';
import { loginSchema } from './auth.schema';

export const authRoutes = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login de usuario
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: admin12345
 *     responses:
 *       200:
 *         description: Login exitoso
 *       400:
 *         description: Error de validacion
 *       401:
 *         description: Credenciales invalidas
 */
authRoutes.post('/login', validate(loginSchema), authController.login);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Obtener usuario autenticado
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario autenticado
 *       401:
 *         description: Token invalido o ausente
 */
authRoutes.get('/me', authMiddleware, authController.me);
