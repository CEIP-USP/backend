import bcrypt from 'bcryptjs';

export class ProfileCredentials {
  constructor(public email: string, public password: string) {}

  public verifyPassword(password: string): boolean | Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  public static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, await bcrypt.genSalt(10));
  }

  public setPassword(password: string): void {
    this.password = password;
  }
}
