import { JwtRefreshCookieService } from '../services/jwt-cookie.service';
import {
  JwtService,
  RefreshJWTPayload,
  TokenTypes,
} from '../services/jwt.service';
import ProfileUseCases from 'domain/profileUseCases';
import pJWT from 'passport-jwt';

export const RefreshTokenStrategyFactory = (
  jwtService: JwtService,
  port: ProfileUseCases
): pJWT.Strategy =>
  new pJWT.Strategy(
    {
      secretOrKey: jwtService.secret,
      jwtFromRequest: JwtRefreshCookieService.retrieve,
    },
    (jwtPayload: RefreshJWTPayload, done) => {
      const { type } = jwtPayload;
      if (type !== TokenTypes.Refresh) {
        return done(null, false);
      }
      return port
        .findByEmail(jwtPayload.sub)
        .then((profile) => done(null, profile))
        .catch((err) => done(err, false));
    }
  );
