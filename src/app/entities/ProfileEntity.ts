import { IDocument, Profile } from 'domain/profile';

export class ProfileEntity {
  constructor(
    public name: string,
    public email: string,
    public password: string,
    public document: IDocument,
    public phone?: string,
    public address?: string,
    public dayOfSecondShot?: Date
  ) {}

  public static toEntity = ({
    name,
    email,
    password,
    document,
    phone,
    address,
    dayOfSecondShot,
  }: Profile): ProfileEntity => {
    return new ProfileEntity(
      name,
      email,
      password,
      document,
      phone,
      address,
      dayOfSecondShot
    );
  };
}
