import { randomUUID } from 'crypto';
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

  constructor(
    public id: string = randomUUID(),
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
    if (!dayOfSecondShot || dayOfSecondShot.getTime() > Date.now()) {
      throw new InvalidSecondShotDateError();
    }

    const status: VaccineStatus = { vaccinated: hasSecondShot };

    if (hasSecondShot) {
      status.dayOfSecondShot = dayOfSecondShot;
    }

    this.vaccineStatus = status;
  }

  public set _role(role: Role) {
    this.role = role;
  }
}
