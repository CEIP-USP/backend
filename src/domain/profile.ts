import { InvalidSecondShotDateError } from './exceptions/InvalidSecondShotDateError';

export interface IDocument {
  type: string;
  value?: string;
}

export class Profile {
  public services: string[] = [];
  public responsibleForValidation = '';
  public _dayOfSecondShot: Date;

  constructor(
    public name: string,
    public email: string,
    public password: string,
    public document: IDocument = { type: 'undocumented' },
    public phone = '',
    public address = '',
    public hasSecondShot = true,
    dayOfSecondShot = new Date()
  ) {
    if (!dayOfSecondShot || dayOfSecondShot.getTime() >= Date.now()) {
      throw new InvalidSecondShotDateError();
    }
    this._dayOfSecondShot = dayOfSecondShot;
  }
}
