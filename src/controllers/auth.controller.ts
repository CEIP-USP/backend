import { JwtService } from 'auth/services/jwt.service';
import { Profile } from 'domain/profile';
import { Request, RequestHandler, Response, Router } from 'express';

export class AuthController {
  private _router = Router();

  constructor(
    private readonly basicAuthMiddleware: RequestHandler,
    private readonly refreshTokenMiddleware: RequestHandler,
    private readonly jwtService: JwtService
  ) {
    this.mapRoutes();
  }

  private async loginRoute(req: Request, res: Response) {
    if (!req.user) throw new Error('User not found');
    this.jwtService.signRefresh(req, res, req.user as Profile);
    res.status(201).send();
  }

  private async refreshRoute(req: Request, res: Response) {
    if (!req.user) throw new Error('User not found');
    this.jwtService.signAccess(res, req.user as Profile);
    res.status(201).send();
  }

  private mapRoutes() {
    this._router.post(
      '/login',
      this.basicAuthMiddleware,
      this.loginRoute.bind(this)
    );
    this._router.post(
      '/refresh',
      this.refreshTokenMiddleware,
      this.refreshRoute.bind(this)
    );
  }

  public get router(): Router {
    return this._router;
  }
}
