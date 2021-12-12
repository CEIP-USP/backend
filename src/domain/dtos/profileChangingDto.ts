import { IDocument } from 'domain/profile';

export interface ProfileChangingDto {
  name?: string;
  email?: string;
  document?: IDocument;
  phone?: string;
  address?: string;
  dayOfSecondShot?: Date;
}
