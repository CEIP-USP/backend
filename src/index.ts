import express, { Application, json } from 'express';

import { IProfileDataPort } from 'domain/ports/profileDataPort';
import { Profile } from 'domain/profile';
import { ProfileController } from 'controllers/profile.controller';
import ProfileUseCases from 'domain/profileUseCases';
import cors from 'cors';

const app: Application = express();
app.use(json());
app.use(cors());

const port: IProfileDataPort = {
  save: async (p) => {
    console.log('saved ', p);
    return p;
  },
  findByText: async ({ q, skip, take }) => {
    return {
      data: [{ name: 'Fulaninho' } as Profile],
      q,
      skip,
      take,
    };
  },
};

const profileUseCases = new ProfileUseCases(port);

const controller = new ProfileController(profileUseCases);

app.use('/profile', controller.router);

app.listen(process.env.PORT, () => {
  console.log(`Server Running on ${process.env.PORT}!`);
});
