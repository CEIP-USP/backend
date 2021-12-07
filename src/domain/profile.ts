import { ObjectId } from 'bson';
import { InvalidSecondShotDateError } from './exceptions/InvalidSecondShotDateError';
import { ProfileCredentials } from './profileCredentials';
import { Role } from './role';

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
    public credentials: ProfileCredentials,
    hasSecondShot: boolean,
    public document: IDocument,
    public phone = '',
    public address = '',
    public dayOfSecondShot: Date | undefined = undefined,
    _roles: Role[] = [],
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
    credentials: ProfileCredentials,
    hasSecondShot: boolean,
    document: IDocument,
    phone = '',
    address = '',
    dayOfSecondShot: Date | undefined = undefined,
    roles: Role[] = []
  ): Promise<Profile> {
    return new Profile(
      name,
      email,
      credentials,
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
}
