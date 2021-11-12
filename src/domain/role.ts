import { InvalidRoleType } from './exceptions/InvalidRoleType';

export class Role {
  public name: RoleType;

  constructor(_role: string) {
    const newRole = RoleType[_role as keyof typeof RoleType];
    if (!newRole) throw new InvalidRoleType(_role);
    this.name = newRole;
  }
}

export enum RoleType {
  Supervisor = 'Supervisor',
  User = 'User',
  ServiceOwner = 'ServiceOwner',
  Professional = 'Professional',
}
