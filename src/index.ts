import { ProfileDataAdapter } from 'app/adapters/profileDataAdapter';
import { ProfileController } from 'app/controllers/profile.controller';
import setupDb from 'app/database';
import cors from 'cors';
import ProfileUseCases from 'domain/profileUseCases';
import express, { Application, json, Request, Response } from 'express';
import { Db } from 'mongodb';

const app: Application = express();
app.use(json());
app.use(cors());

async function main() {
  try {
    const db = await setupDb();

    const profileDataAdapter = new ProfileDataAdapter(db as Db);

    const profileUseCases = new ProfileUseCases(profileDataAdapter);

    const controller = new ProfileController(profileUseCases);

    app.use('/profile', controller.router);

    app.listen(process.env.PORT, () => {
      console.log(`Server Running on ${process.env.PORT}!`);
    });

    app.use('/', (req: Request, res: Response) => {
      res.status(200).send({ data: 'Hello, world!' });
    });
  } catch (e) {
    console.error(e);
  }
}

main();
