import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  app.get('/health', (_req, res) => {
    res.status(200).json({ success: true, message: 'ok' });
  });

  return app;
};
