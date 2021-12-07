import { ObjectId } from 'bson';
import bcrypt from 'bcryptjs';
import { InvalidSecondShotDateError } from './exceptions/InvalidSecondShotDateError';
import { Role, RoleType } from './role';

export interface IDocument {
  type: string;
  value?: string;
}

export interface VaccineStatus {
  vaccinated: boolean;
  dayOfSecondShot?: Date;
}

export class Profile {
  public services: string[] = [];
  public responsibleForValidation = '';
  public readonly vaccineStatus: VaccineStatus;

  public roles: Role[];

  constructor(
    public name: string,
    public email: string,
    public password: string,
    hasSecondShot: boolean,
    public document: IDocument,
    public phone = '',
    public address = '',
    public dayOfSecondShot: Date | undefined = undefined,
    _roles: Role[] = [new Role(RoleType.User)],
    public _id: ObjectId = new ObjectId()
  ) {
    if (!Profile.validateDayOfSecondShot(dayOfSecondShot))
      throw new InvalidSecondShotDateError();

    this.roles = _roles;

    const status: VaccineStatus = { vaccinated: hasSecondShot };

    if (hasSecondShot) {
      status.dayOfSecondShot = dayOfSecondShot;
    }

    this.vaccineStatus = status;
  }

  static async create(
    name: string,
    email: string,
    password: string,
    hasSecondShot: boolean,
    document: IDocument,
    phone = '',
    address = '',
    dayOfSecondShot: Date | undefined = undefined,
    roles: Role[] = [new Role(RoleType.User)]
  ): Promise<Profile> {
    return new Profile(
      name,
      email,
      await Profile.hashPassword(password),
      hasSecondShot,
      document,
      phone,
      address,
      dayOfSecondShot,
      roles
    );
  }

  static validateDayOfSecondShot(date?: Date): boolean {
    if (!date || isNaN(date.getTime())) return false;
    const now = new Date();
    return now.getTime() > date.getTime();
  }

  private static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, await bcrypt.genSalt(10));
  }

  public verifyPassword(password: string): boolean | Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
