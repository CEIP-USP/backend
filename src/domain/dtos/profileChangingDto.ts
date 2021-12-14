import { IDocument } from 'domain/profile';

export class ProfileChangingDto {
  constructor(
    public name?: string,
    public email?: string,
    public document?: IDocument,
    public phone?: string,
    public address?: string,
    public dayOfSecondShot?: Date
  ) {}
}
