import cors from 'cors';
import { Application } from 'express';

export const useCors = (app: Application): void => {
  const allowedOrigins = (process.env.CORS + '')
    .split(',')
    .map((x) => x.trim());
  app.use(
    cors({
      credentials: true,
      origin: (origin, cb) => {
        cb(null, allowedOrigins.includes(origin + ''));
      },
    })
  );
};
