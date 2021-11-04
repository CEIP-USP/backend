import { Profile } from 'domain/profile';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtRefreshCookieService } from './jwt-cookie.service';

export enum TokenTypes {
  Access = 'access',
  Refresh = 'refresh',
}

export type TokenPayload = {
  sub: string;
};

export type RefreshJWTPayload = {
  type: TokenTypes.Refresh;
} & TokenPayload;

export type AccessJWTPayload = {
  name: string;
  email: string;
  type: TokenTypes.Access;
} & TokenPayload;

export interface IJWTService {
  signRefresh(profile: Profile): string;
  signAccess(profile: Profile): string;
}

export class JwtService {
  private static readonly refreshTokenExpiresIn = '30d';
  private static readonly accessTokenExpiresIn = '15m';

  constructor(readonly secret = process.env.JWT_SECRET + '') {}

  signRefresh(req: Request, res: Response, profile: Profile): void {
    const payload: Omit<RefreshJWTPayload, 'sub'> = {
      type: TokenTypes.Refresh,
    };
    const token = jwt.sign(payload, this.secret, {
      subject: profile.email,
      expiresIn: JwtService.refreshTokenExpiresIn,
    });

    JwtRefreshCookieService.set(req, res, token);
  }

  signAccess(res: Response, profile: Profile): void {
    const payload: Omit<AccessJWTPayload, 'sub'> = {
      name: profile.name,
      email: profile.email,
      type: TokenTypes.Access,
    };
    const token = jwt.sign(payload, this.secret, {
      subject: profile.email,
      expiresIn: JwtService.accessTokenExpiresIn,
    });

    res.json({
      accessToken: token,
    });
  }
}
