import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';

type AuthUser = {
  idUser: string;
  emailUser: string;
};

declare global {
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
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthUser;
    req.user = {
      idUser: payload.idUser,
      emailUser: payload.emailUser
    };

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: 'Token invalido o ausente'
    });
  }
};
