import { Role, RoleTypes } from '../../../../domain/role';
import { IsOwnerOrHasRoleAuthorizationStrategy } from '../is-owner-or-has-role.authorization-strategy';
import { Request } from 'express';
import { AuthorizationResult } from '../authorization-strategy';

describe('IsOwnerOrHasRoleAuthorizationStrategy', () => {
  const sampleRoles = [RoleTypes.COORDENACAO_DE_SERVICO];
  const sampleRequest: Partial<Request> = {
    user: {
      _id: '12345678',
      roles: sampleRoles.map((r) => new Role(r)),
    },
    params: {
      id: '12345678',
    },
  };
  const strategy = new IsOwnerOrHasRoleAuthorizationStrategy(sampleRoles);

  it('should return UNAUTHENTICATED if there is no req.user', async () => {
    const result = await strategy.authorize({
      ...sampleRequest,
      user: undefined,
    } as Request);
    expect(result).toBe(AuthorizationResult.UNAUTHENTICATED);
  });

  it('should return UNAUTHORIZED if the user is not the owner has no matching roles', async () => {
    const result = await strategy.authorize({
      ...sampleRequest,
      user: {
        _id: '123456789',
        roles: [],
      },
    } as Request);
    expect(result).toBe(AuthorizationResult.UNAUTHORIZED);
  });

  it('should return AUTHORIZED if the user does not have a matching role but is the owner', async () => {
    const result = await strategy.authorize({
      ...sampleRequest,
      user: {
        ...sampleRequest.user,
        roles: [],
      },
    } as Request);
    expect(result).toBe(AuthorizationResult.AUTHORIZED);
  });

  it('should return AUTHORIZED if the user has a matching role and is not the owner', async () => {
    const result = await strategy.authorize({
      ...sampleRequest,
      user: {
        ...sampleRequest.user,
        roles: [RoleTypes.COORDENACAO_DE_SERVICO],
      },
    } as Request);
    expect(result).toBe(AuthorizationResult.AUTHORIZED);
  });
});
