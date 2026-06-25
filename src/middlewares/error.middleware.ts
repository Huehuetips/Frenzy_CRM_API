import { ErrorRequestHandler } from 'express';
import { Prisma } from '@prisma/client';

import { AppError } from '../shared/errors';

export const errorMiddleware: ErrorRequestHandler = (err, _req, res, next) => {
  void next;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({ success: false, message: 'El registro ya existe (campo duplicado)' });
      return;
    }

    if (err.code === 'P2025') {
      res.status(404).json({ success: false, message: 'Registro no encontrado' });
      return;
    }

    if (err.code === 'P2003') {
      res.status(400).json({ success: false, message: 'Referencia invalida' });
      return;
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({ success: false, message: 'Datos invalidos' });
    return;
  }

  const appErr = err as AppError;
  const statusCode = appErr.statusCode ?? 500;

  res.status(statusCode).json({
    success: false,
    message: appErr.message ?? 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: appErr.stack })
  });
};
