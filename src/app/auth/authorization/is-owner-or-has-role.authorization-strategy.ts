import { AuthorizationResult } from './authorization-strategy';
import { Request } from 'express';
import { Profile } from '../../../domain/profile';
import { RequireRoleAuthorizationStrategy } from './require-role.authorization-strategy';

export class IsOwnerOrHasRoleAuthorizationStrategy extends RequireRoleAuthorizationStrategy {
  protected async _authorize(
    request: Request,
    profile: Profile
  ): Promise<AuthorizationResult> {
    if (!profile) return AuthorizationResult.UNAUTHENTICATED;

    const isOwner = profile._id.toString() === request.params.id;
    if (isOwner) return AuthorizationResult.AUTHORIZED;

    return super._authorize(request, profile);
  }
}
