import { Profile } from 'domain/profile';
import { BasicStrategy } from 'passport-http';

export const BasicStrategyFactory: (
  loginFN: (username: string, password: string) => Promise<Profile | undefined>
) => Promise<BasicStrategy> | BasicStrategy = (loginFN) =>
  new BasicStrategy((username, password, done) => {
    return loginFN(username, password)
      .then((profile) => done(null, profile))
      .catch(done);
  });
