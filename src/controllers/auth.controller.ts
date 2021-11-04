import { Profile } from 'domain/profile';
import { Router } from 'express';
import passport from 'passport';

export class AuthController {
  private _router = Router();

  constructor(
    verifyCredentials: (username, password) => Promise<Profile | undefined>,
    verifyAccessToken: (token) => Promise<Profile | undefined>,
    verifyRefreshToken: (token) => Promise<Profile | undefined>
  ) {
    this.mapRoutes();
  }

  private async loginRoute(req: Request & { user: Profile }, res: Response) {
    const profile = req.user;
    res.json();
  }

  private async mapLogin() {
    passport.use();
    this._router.post('/login', passport.authenticate('local'));
  }

  private mapRoutes() {
    this.mapLogin();
  }

  public get router(): Router {
    return this.router;
  }
}
