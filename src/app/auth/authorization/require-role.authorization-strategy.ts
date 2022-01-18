import {
  AuthorizationResult,
  AuthorizationStrategy,
} from './authorization-strategy';
import { Request } from 'express';
import { Profile } from '../../../domain/profile';
import { RoleTypes } from '../../../domain/role';

export class RequireRoleAuthorizationStrategy extends AuthorizationStrategy {
  constructor(private allowedRoles: RoleTypes[]) {
    super();
  }

  protected async _authorize(
    request: Request,
    profile?: Profile
  ): Promise<AuthorizationResult> {
    if (!profile) return AuthorizationResult.UNAUTHENTICATED;

    const hasRole = profile.roles.some((role) =>
      (this.allowedRoles as string[]).includes(role.name)
    );
    if (hasRole) return AuthorizationResult.AUTHORIZED;

    return AuthorizationResult.UNAUTHORIZED;
  }
}
