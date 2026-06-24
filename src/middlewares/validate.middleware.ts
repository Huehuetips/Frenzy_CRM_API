import { RequestHandler } from 'express';
import { ZodSchema } from 'zod';

export const validate =
  (schema: ZodSchema): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: result.error.errors.map((error) => ({
          field: error.path.join('.'),
          message: error.message
        }))
      });
      return;
    }

    req.body = result.data;
    next();
  };
