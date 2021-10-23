import { InvalidSecondShotDateError } from './exceptions/InvalidSecondShotDateError';

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
    public name: string,
    public email: string,
    public password: string,
    hasSecondShot: boolean,
    public document: IDocument = { type: 'undocumented' },
    public phone = '',
    public address = '',
    dayOfSecondShot: Date | undefined = undefined
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
}
