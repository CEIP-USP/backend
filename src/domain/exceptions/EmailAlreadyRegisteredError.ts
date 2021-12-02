export class EmailAlreadyRegisteredError extends Error {
  constructor(private email: string) {
    super(`email already registered: ${email}`);
  }
}
