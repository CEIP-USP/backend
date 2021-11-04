import { Request, Response } from 'express';

export abstract class JwtRefreshCookieService {
  public static readonly COOKIE_NAME = 'refresh_token';

  static set(req: Request, res: Response, refreshToken: string): void {
    res.cookie(JwtRefreshCookieService.COOKIE_NAME, refreshToken, {
      httpOnly: true,
      expires: req.query['remember-me']
        ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
        : undefined,
    });
  }

  static retrieve(req: Request): string {
    return req.cookies[JwtRefreshCookieService.COOKIE_NAME] + '';
  }

  static remove(res: Response): void {
    res.cookie(JwtRefreshCookieService.COOKIE_NAME, '');
  }
}
