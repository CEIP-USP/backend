import {
  TextSearchableQuery,
  TextSearchableQueryParams,
} from 'common/pagedQuery';
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
    hasSecondShot,
    document,
    phone,
    address,
    dayOfSecondShot,
  }: PreRegistrationData): Promise<Profile> {
    const profile = new Profile(
      name,
      email,
      password,
      hasSecondShot,
      document,
      phone,
      address,
      dayOfSecondShot
    );
    return this.profileDataPort.save(profile);
  }

  public findByText({
    q,
    skip,
    take,
  }: TextSearchableQueryParams): Promise<TextSearchableQuery<Profile>> {
    return this.profileDataPort.findByText({ q, skip, take });
  }
}
