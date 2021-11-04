import express, { Application, json } from 'express';

import { IProfileDataPort } from 'domain/ports/profileDataPort';
import { Profile } from 'domain/profile';
import { ProfileController } from 'controllers/profile.controller';
import ProfileUseCases from 'domain/profileUseCases';
import cors from 'cors';
import cookies from 'cookie-parser';
import passport from 'passport';
import { BasicStrategyFactory } from 'auth/strategies/basic.strategy-factory';
import { AuthController } from 'controllers/auth.controller';
import { JwtService } from 'auth/services/jwt.service';
import { RefreshTokenStrategyFactory } from 'auth/strategies/refresh-token.strategy-factory';
import { AccessTokenStrategyFactory } from 'auth/strategies/access-token.strategy-factory';

async function main() {
  const app: Application = express();
  app.use(passport.initialize());
  app.use(json());
  app.use(cors());
  app.use(cookies());

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

  const jwtService = new JwtService();

  const authMiddlewares = {
    basic: passport.authenticate(
      await BasicStrategyFactory(
        profileUseCases.verifyCredentials.bind(profileUseCases)
      ),
      { session: false }
    ),
    refreshToken: passport.authenticate(
      await RefreshTokenStrategyFactory(jwtService, profileUseCases),
      { session: false }
    ),
    accessToken: passport.authenticate(
      await AccessTokenStrategyFactory(jwtService, profileUseCases),
      { session: false }
    ),
  };

  const authController = new AuthController(
    authMiddlewares.basic,
    authMiddlewares.refreshToken,
    jwtService
  );

  const controller = new ProfileController(
    profileUseCases,
    authMiddlewares.accessToken
  );

  app.use('/auth', authController.router);
  app.use('/profile', controller.router);

  app.listen(process.env.PORT, () => {
    console.log(`Server Running on ${process.env.PORT}!`);
  });
}

main();
