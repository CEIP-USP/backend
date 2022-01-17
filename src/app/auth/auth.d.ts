import { Profile } from '../../domain/profile';

declare global {
  namespace Express {
    export type User = Profile;
  }
}
