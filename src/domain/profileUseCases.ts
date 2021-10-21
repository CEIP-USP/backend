import { IProfileDataPort } from './ports/profileDataPort';
import { IDocument, Profile } from './profile';

export interface PreRegistrationData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  hasSecondShot: boolean;
  dayOfSecondShot?: Date;
  document: IDocument;
}

export default class ProfileUseCases {
  constructor(private readonly profileDataPort: IProfileDataPort) {}

  public performPreRegistration({
    name,
    email,
    password,
    phone,
    address,
    hasSecondShot,
    dayOfSecondShot,
    document,
  }: PreRegistrationData): Promise<Profile> {
    const profile = new Profile(
      name,
      email,
      password,
      document,
      phone,
      address,
      hasSecondShot,
      dayOfSecondShot
    );
    return this.profileDataPort.save(profile);
  }
}
