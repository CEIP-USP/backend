import { Role, RoleTypes } from '../../../../domain/role';
import { Request } from 'express';
import { AuthorizationResult } from '../authorization-strategy';
import { RequireRoleAuthorizationStrategy } from '../require-role.authorization-strategy';

describe('RequireRoleAuthorizationStrategy', () => {
  const sampleRoles = [RoleTypes.COORDENACAO_DE_SERVICO];
  const sampleRequest: Partial<Request> = {
    user: {
      roles: sampleRoles.map((r) => new Role(r)),
    },
  };
  const strategy = new RequireRoleAuthorizationStrategy(sampleRoles);

  it('should return UNAUTHENTICATED if there is no req.user', async () => {
    const result = await strategy.authorize({
      ...sampleRequest,
      user: undefined,
    } as Request);
    expect(result).toBe(AuthorizationResult.UNAUTHENTICATED);
  });

  it('should return UNAUTHORIZED if the user has no matching roles', async () => {
    const result = await strategy.authorize({
      ...sampleRequest,
      user: {
        roles: [],
      },
    } as Request);
    expect(result).toBe(AuthorizationResult.UNAUTHORIZED);
  });

  it('should return AUTHORIZED if the user has a matching role', async () => {
    const result = await strategy.authorize({
      ...sampleRequest,
    } as Request);
    expect(result).toBe(AuthorizationResult.AUTHORIZED);
  });
});
