export class ProfileNotFoundError extends Error {
  constructor(fieldUsed: string, valueUsed: string) {
    super(`Profile not found with ${fieldUsed} = ${valueUsed}`);
  }
}
