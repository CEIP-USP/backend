import express, { Application, json } from 'express';

import { IProfileDataPort } from 'domain/ports/profileDataPort';
import { Profile } from 'domain/profile';
import { ProfileController } from 'controllers/profile.controller';
import ProfileUseCases from 'domain/profileUseCases';
import cors from 'cors';
import passport from 'passport';
import { BasicStrategyFactory } from 'auth/strategies/basic.strategy-factory';

async function main() {
  const app: Application = express();
  app.use(passport.initialize());
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
    findByEmail: function (email: string): Promise<Profile | undefined> {
      return Promise.resolve(
        new Profile(
          'Fulano',
          email,
          'f',
          true,
          { type: 'cpf' },
          '12345678901',
          '12345678901',
          new Date(0)
        )
      );
    },
  };

  const profileUseCases = new ProfileUseCases(port);

  const controller = new ProfileController(profileUseCases);
  passport.use(
    await BasicStrategyFactory(
      profileUseCases.verifyCredentials.bind(profileUseCases)
    )
  );

  app.use('/profile', controller.router);

  app.listen(process.env.PORT, () => {
    console.log(`Server Running on ${process.env.PORT}!`);
  });
}

main();
