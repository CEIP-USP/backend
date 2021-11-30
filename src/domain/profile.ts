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
    public _id: ObjectId = new ObjectId(),
    public name: string,
    public email: string,
    public password: string,
    hasSecondShot: boolean,
    public document: IDocument,
    public phone = '',
    public address = '',
    public dayOfSecondShot: Date | undefined = undefined,
    public role: Role = new Role(RoleType.User)
  ) {
    this._roles = [this.role];

    if (!dayOfSecondShot || dayOfSecondShot.getTime() > Date.now()) {
      throw new InvalidSecondShotDateError();
    }

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

  public verifyPassword(password: string): boolean | Promise<boolean> {
    return this.password === password;
  }
}
