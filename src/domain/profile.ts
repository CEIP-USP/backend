import { ObjectId } from 'bson';
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

  private _roles: Role[];

  constructor(
    public name: string,
    public email: string,
    public password: string,
    hasSecondShot: boolean,
    public document: IDocument,
    public phone = '',
    public address = '',
    public dayOfSecondShot: Date | undefined = undefined,
    public role: Role = new Role(RoleType.User),
    public _id: ObjectId = new ObjectId()
  ) {
    if (!Profile.validateDayOfSecondShot(dayOfSecondShot))
      throw new InvalidSecondShotDateError();

    this._roles = [this.role];

    const status: VaccineStatus = { vaccinated: hasSecondShot };

    if (hasSecondShot) {
      status.dayOfSecondShot = dayOfSecondShot;
    }

    this.vaccineStatus = status;
  }

  set roles(_roles: Role[]) {
    this._roles = _roles;
  }

  get roles(): Role[] {
    return this._roles;
  }

  static validateDayOfSecondShot(date?: Date): boolean {
    if (!date || isNaN(date.getTime())) return false;
    const now = new Date();
    return now.getTime() > date.getTime();
  }

  public verifyPassword(password: string): boolean | Promise<boolean> {
    return this.password === password;
  }
}
