import { InvalidRoleType } from 'domain/exceptions/InvalidRoleType';
import { InvalidSecondShotDateError } from 'domain/exceptions/InvalidSecondShotDateError';
import ProfileUseCases from 'domain/profileUseCases';
import { Role } from 'domain/role';
import { Router, Response, Request } from 'express';

export class ProfileController {
  private _router: Router;
  constructor(protected readonly profileUseCases: ProfileUseCases) {
    this._router = Router();
    this.mapRoutes();
  }

  private async preRegister(req: Request, res: Response) {
    try {
      const result = await this.profileUseCases.performPreRegistration({
        ...req.body,
        dayOfSecondShot: req.body.dayOfSecondShot
          ? new Date(req.body.dayOfSecondShot)
          : undefined,
      });
      res.json(result).status(201);
    } catch (e) {
      const exception = e as Error;
      console.error(e);
      if (exception instanceof InvalidSecondShotDateError) {
        res.status(422).send();
      } else {
        res.status(500).send();
      }
    }
  }

  private async updateRole(req: Request, res: Response) {
    try {
      const result = await this.profileUseCases.updateRole(
        req.body.profileiId,
        new Role(req.body.newRole)
      );
      res.json(result).status(201);
    } catch (e) {
      const exception = e as Error;
      console.error(e);
      if (exception instanceof InvalidRoleType) {
        res.status(422).send();
      } else {
        res.status(500).send();
      }
    }
  }

  private mapRoutes() {
    this._router.post('/', this.preRegister.bind(this));
    this._router.put('/update-role', this.updateRole.bind(this));
  }

  public get router(): Router {
    return this._router;
  }
}