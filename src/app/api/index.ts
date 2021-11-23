import express, { Application, json } from 'express';
import cors from 'cors';
import { ProfileController } from 'app/controllers/profile.controller';

export function setupAPI(profileCtrl: ProfileController): Application {
  const app: Application = express();
  app.use(json());
  app.use(cors());

  app.use('/profile', profileCtrl.router);

  return app;
}
