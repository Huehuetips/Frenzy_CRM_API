import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import * as authController from './auth.controller';
import { loginSchema } from './auth.schema';

export const createAuthRoutes = (): Router => {
  const authRoutes = Router();

  const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Demasiados intentos de login, intente de nuevo en 1 minuto' }
  });

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
  authRoutes.post('/login', loginLimiter, validate(loginSchema), authController.login);

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

  return authRoutes;
};
