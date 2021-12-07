import { Request, RequestHandler, Response, Router } from 'express';
import { InvalidRoleType } from '../../domain/exceptions/InvalidRoleType';
import { Role } from '../../domain/role';
import { InvalidSecondShotDateError } from '../../domain/exceptions/InvalidSecondShotDateError';
import ProfileUseCases from '../../domain/profileUseCases';
import { ValidationError } from 'joi';
import { EmailAlreadyRegisteredError } from '../../domain/exceptions/EmailAlreadyRegisteredError';
import { DocumentAlreadyRegisteredError } from '../../domain/exceptions/DocumentAlreadyRegisteredError';

export class ProfileController {
  private readonly _router: Router;

  constructor(
    protected readonly profileUseCases: ProfileUseCases,
    protected readonly accessTokenMiddleware: RequestHandler
  ) {
    this._router = Router();
    this.mapRoutes();
  }

  public get router(): Router {
    return this._router;
  }

  private async preRegister(req: Request, res: Response) {
    try {
      const result = await this.profileUseCases.performPreRegistration({
        ...req.body,
        dayOfSecondShot: req.body.dayOfSecondShot
          ? new Date(req.body.dayOfSecondShot)
          : undefined,
      });
      return res.json(result).status(201);
    } catch (e) {
      const exception = e as Error;
      console.error(e);
      if (exception instanceof ValidationError) {
        res.status(400).json(exception.details);
      } else if (exception instanceof EmailAlreadyRegisteredError) {
        res.status(409).json({
          message: exception.message,
          path: ['email'],
        });
      } else if (exception instanceof DocumentAlreadyRegisteredError) {
        res.status(409).json({
          message: exception.message,
          path: ['document'],
        });
      } else if (exception instanceof InvalidSecondShotDateError) {
        res.status(422).send();
      } else {
        res.status(500).send();
      }
    }
  }

  private async getProfile(req: Request, res: Response) {
    try {
      const { skip: _skip, take: _take, q: _q } = req.query;

      const parseIntFromQuery = (value: any) => !!value && parseInt(value);

      const q = _q ? _q.toString() : '';
      const skip = parseIntFromQuery(_skip) || 0;
      const take = Math.min(parseIntFromQuery(_take) || 10, 50);

      res.json(
        await this.profileUseCases.findByText({
          q,
          skip,
          take,
        })
      );
    } catch (e) {
      console.error(e);
      res.status(500).send();
    }
  }

  private async updateRole(req: Request, res: Response) {
    try {
      const result = await this.profileUseCases.addRole(
        req.params.id,
        new Role(req.body.newRole)
      );
      res.json(result).status(200);
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
    this._router.get(
      '/',
      this.accessTokenMiddleware,
      this.getProfile.bind(this)
    );
    this._router.put('/:id/role', this.updateRole.bind(this));
  }
}
