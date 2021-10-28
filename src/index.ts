import express, { Application, Request, Response, json } from 'express';
import { ProfileController } from 'app/controllers/profile.controller';
import { IProfileDataPort } from 'domain/ports/profileDataPort';
import ProfileUseCases from 'domain/profileUseCases';
import cors from 'cors';
import setupDb from 'app/database';

const app: Application = express();
app.use(json());
app.use(cors());

setupDb();

const port: IProfileDataPort = {
  save: async (p) => {
    console.log('saved ', p);
    return p;
  },
};

const profileUseCases = new ProfileUseCases(port);

const controller = new ProfileController(profileUseCases);

app.use('/profile', controller.router);

app.listen(process.env.PORT, () => {
  console.log(`Server Running on ${process.env.PORT}!`);
});

app.use('/', (req: Request, res: Response) => {
  res.status(200).send({ data: 'Hello, world!' });
});
