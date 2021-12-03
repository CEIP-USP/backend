import { Request, RequestHandler, Response, Router } from 'express';
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

  private async getProfileByID(req: Request, res: Response) {
    try {
      const id = req.params.id + '';
      const profile = await this.profileUseCases.findById(id);
      if (profile)
        res.status(200).json({
          name: profile.name,
          email: profile.email,
          document: profile.document,
          phone: profile.phone,
          adress: profile.address,
          dayOfSecondShot: profile.dayOfSecondShot?.toISOString(),
          role: profile.role,
          _id: profile._id,
        });
      else res.status(404).send();
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  }

  private mapRoutes() {
    this._router.post('/', this.preRegister.bind(this));
    this._router.get(
      '/',
      this.accessTokenMiddleware,
      this.getProfile.bind(this)
    );
    this._router.get(
      '/:id',
      this.accessTokenMiddleware,
      this.getProfileByID.bind(this)
    );
  }
}
