import {
  AuthorizationResult,
  AuthorizationStrategy,
} from '../authorization/authorization-strategy';
import { RequestHandler } from 'express';

export const authorizationStrategyMiddleware = (
  strategy: AuthorizationStrategy
): RequestHandler => {
  return async (req, res, next) => {
    const result = await strategy.authorize(req);
    if (result === AuthorizationResult.AUTHORIZED) {
      next();
      return;
    }
    switch (result) {
      case AuthorizationResult.UNAUTHENTICATED:
        res.status(401).send('Unauthorized');
        break;
      case AuthorizationResult.UNAUTHORIZED:
        res.status(403).send('Forbidden');
        break;
    }
  };
};
