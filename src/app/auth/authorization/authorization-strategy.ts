import { Request } from 'express';
import { Profile } from '../../../domain/profile';

export enum AuthorizationResult {
  AUTHORIZED = 'AUTHORIZED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
}

export abstract class AuthorizationStrategy {
  async authorize(request: Request): Promise<AuthorizationResult> {
    const profile = request.user as Profile;
    return this._authorize(request, profile);
  }

  protected abstract _authorize(
    request: Request,
    profile?: Profile
  ): Promise<AuthorizationResult>;
}
