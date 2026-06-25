import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from './config/swagger';
import { errorMiddleware } from './middlewares/error.middleware';
import { activitiesRoutes } from './modules/activities/activities.routes';
import { authRoutes } from './modules/auth/auth.routes';
import { leadsRoutes } from './modules/leads/leads.routes';
import { webhooksRoutes } from './modules/webhooks/webhooks.routes';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(
      swaggerSpec as Parameters<typeof swaggerUi.setup>[0]
    )
  );

  app.get('/api/health', (_req, res) => {
    res.status(200).json({ success: true, message: 'ok' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/leads/:id/activities', activitiesRoutes);
  app.use('/api/leads', leadsRoutes);
  app.use('/webhooks', webhooksRoutes);

  app.use(errorMiddleware);

  return app;
};
