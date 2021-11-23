import express, { Application, json, Request, Response } from 'express';
import { ProfileController } from './app/controllers/profile.controller';
import ProfileUseCases from './domain/profileUseCases';
import cors from 'cors';
import setupDb from './app/database';
import { ProfileDataAdapter } from './app/adapters/profileDataAdapter';
import { Db } from 'mongodb';
import cookies from 'cookie-parser';
import passport from 'passport';
import { BasicStrategyFactory } from './auth/strategies/basic.strategy-factory';
import { JwtService } from './auth/services/jwt.service';
import { AccessTokenStrategyFactory } from './auth/strategies/access-token.strategy-factory';
import { RefreshTokenStrategyFactory } from './auth/strategies/refresh-token.strategy-factory';
import { AuthController } from './controllers/auth.controller';

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
      basic: passport.authenticate(
        await BasicStrategyFactory(
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
      authMiddlewares.basic,
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
  } catch (e) {
    console.error(e);
  }
}

main();
