import { Profile } from '../domain/profile';

declare global {
  namespace Express {
    export interface Request {
      user?: Profile;
    }
  }
}
