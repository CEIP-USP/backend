import { InvalidSecondShotDateError } from '../../domain/exceptions/InvalidSecondShotDateError';
import ProfileUseCases from '../../domain/profileUseCases';
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

  private async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updatedProfile = await this.profileUseCases.updateProfile(
        id,
        req.body
      );
      res.status(200).json(updatedProfile);
    } catch (e) {
      if ((e as string).match('not found')) res.status(404).send();
    }
  }

  private mapRoutes() {
    this._router.post('/', this.preRegister.bind(this));
    this._router.put('/:id', this.update.bind(this));
  }

  public get router(): Router {
    return this._router;
  }
}
