import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { env } from '../config/env';

const jwtPayloadSchema = z.object({
  idUser: z.string().uuid(),
  emailUser: z.string().email()
});

type AuthUser = z.infer<typeof jwtPayloadSchema>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authMiddleware: RequestHandler = (req, res, next) => {
  const authorization = req.header('Authorization');

  if (!authorization?.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Token invalido o ausente'
    });
    return;
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const result = jwtPayloadSchema.safeParse(decoded);

    if (!result.success) {
      res.status(401).json({
        success: false,
        message: 'Token invalido o ausente'
      });
      return;
    }

    req.user = result.data;
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: 'Token invalido o ausente'
    });
  }
};
