export class Role {
  constructor(public role: RoleType) {}
}

export enum RoleType {
  Supervisor,
  User,
  ServiceOwner,
  Professional,
}
