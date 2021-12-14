import { IDocument } from '../profile';

export class ProfileChangingDto {
  public dayOfSecondShot?: Date;

  constructor(
    public name?: string,
    public email?: string,
    public document?: IDocument,
    public phone?: string,
    public address?: string,
    dayOfSecondShot?: string
  ) {
    this.dayOfSecondShot = dayOfSecondShot
      ? new Date(dayOfSecondShot)
      : undefined;
  }
}
