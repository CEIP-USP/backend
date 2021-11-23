export class InvalidRoleType extends Error {
  constructor(private role: string) {
    super(`invalid role: ${role}`);
  }
}
