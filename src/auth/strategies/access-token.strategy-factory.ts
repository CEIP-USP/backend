import {
  AccessJWTPayload,
  JwtService,
  TokenTypes,
} from '../services/jwt.service';
import ProfileUseCases from 'domain/profileUseCases';
import pJWT, { ExtractJwt } from 'passport-jwt';

export const AccessTokenStrategyFactory = (
  jwtService: JwtService,
  port: ProfileUseCases
): pJWT.Strategy =>
  new pJWT.Strategy(
    {
      secretOrKey: jwtService.secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    (jwtPayload: AccessJWTPayload, done) => {
      const { type } = jwtPayload;
      if (type !== TokenTypes.Access) {
        return done(null, false);
      }
      return port
        .findByEmail(jwtPayload.sub)
        .then((profile) => done(null, profile))
        .catch((err) => done(err, false));
    }
  );
