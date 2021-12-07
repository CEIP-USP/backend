import { Profile } from '../../../domain/profile';
import { Strategy as LocalStrategy } from 'passport-local';

export const LocalStrategyFactory: (
  loginFN: (username: string, password: string) => Promise<Profile | undefined>
) => LocalStrategy = (loginFN) =>
  new LocalStrategy((username: string, password: string, done) => {
    return loginFN(username, password)
      .then((profile) => done(null, profile))
      .catch(done);
  });
