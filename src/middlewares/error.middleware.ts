import { ErrorRequestHandler } from 'express';
import { AppError } from '../shared/errors';

export const errorMiddleware: ErrorRequestHandler = (err: AppError, _req, res, _next) => {
  const statusCode = err.statusCode ?? 500;

  res.status(statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
