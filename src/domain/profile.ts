import { InvalidSecondShotDateError } from './exceptions/InvalidSecondShotDateError';
import { Role, RoleType } from './role';
import { uuid } from 'uuidv4';

export interface Contact {
  email?: string;
  phone?: string[];
  address?: string;
}

export class Profile {
  public id: string = uuid();
  public services: string[] = [];
  public responsibleForValidation = '';
  public _role: Role = new Role(RoleType.User);

  constructor(
    public name: string,
    public cpf: string | null = null, // TODO: validate in the future
    private _contact: Contact = {},
    private _dayOfSecondShot: Date | null
  ) {
    if (!_dayOfSecondShot || _dayOfSecondShot.getTime() >= Date.now()) {
      throw new InvalidSecondShotDateError();
    }

    this.dayOfSecondShot = _dayOfSecondShot;
  }

  public set role(role: Role) {
    this.role = role;
  }

  public set phone(phone: string[]) {
    this._contact.phone = phone;
  }

  public set email(email: string) {
    this._contact.email = email;
  }

  public set address(address: string) {
    this._contact.address = address;
  }

  public get contact(): Contact {
    return this._contact;
  }

  public set dayOfSecondShot(dayOfSecondShot: Date | null) {
    this._dayOfSecondShot = dayOfSecondShot;
  }

  public get dayOfSecondShot(): Date | null {
    return this._dayOfSecondShot;
  }
}
