import express, { Application, json, Request, Response } from 'express';
import { ProfileController } from './app/controllers/profile.controller';
import ProfileUseCases from './domain/profileUseCases';
import cors from 'cors';
import setupDb from './app/database';
import { ProfileDataAdapter } from './app/adapters/profileDataAdapter';
import { Db } from 'mongodb';
import cookies from 'cookie-parser';
import passport from 'passport';
import { LocalStrategyFactory } from './app/auth/strategies/local.strategy-factory';
import { JwtService } from './app/auth/services/jwt.service';
import { AccessTokenStrategyFactory } from './app/auth/strategies/access-token.strategy-factory';
import { RefreshTokenStrategyFactory } from './app/auth/strategies/refresh-token.strategy-factory';
import { AuthController } from './app/controllers/auth.controller';

const app: Application = express();
app.use(passport.initialize());
app.use(json());
app.use(cors({ credentials: true, origin: process.env.CORS }));
app.use(cookies());

async function main() {
  try {
    const db = await setupDb();

    const profileDataAdapter = new ProfileDataAdapter(db as Db);

    const profileUseCases = new ProfileUseCases(profileDataAdapter);

    const jwtService = new JwtService();

    const authMiddlewares = {
      local: passport.authenticate(
        LocalStrategyFactory(
          profileUseCases.verifyCredentials.bind(profileUseCases)
        ),
        { session: false }
      ),
      refreshToken: passport.authenticate(
        RefreshTokenStrategyFactory(jwtService, profileUseCases),
        { session: false }
      ),
      accessToken: passport.authenticate(
        AccessTokenStrategyFactory(jwtService, profileUseCases),
        { session: false }
      ),
    };

    const authController = new AuthController(
      authMiddlewares.local,
      authMiddlewares.refreshToken,
      jwtService
    );

    const controller = new ProfileController(
      profileUseCases,
      authMiddlewares.accessToken
    );

    app.use('/auth', authController.router);
    app.use('/profiles', controller.router);

    app.listen(process.env.PORT, () => {
      console.log(`Server Running on ${process.env.PORT}!`);
    });

    app.get('/', (req: Request, res: Response) => {
      res.status(200).send({ data: 'Hello, world!' });
    });
  } catch (e) {
    console.error(e);
  }
}

main();
