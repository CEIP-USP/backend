import { IDocument, Profile } from './profile';
import { IProfileDataPort } from './ports/profileDataPort';
import { Role } from './role';
import {
  TextSearchableQuery,
  TextSearchableQueryParams,
} from 'common/pagedQuery';
import { ObjectId } from 'bson';

export interface PreRegistrationData {
  id: string;
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
      new ObjectId(),
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

  public async updateRole(id: string, newRole: Role): Promise<Profile> {
    const profile = await this.profileDataPort.findById(id);
    profile.role = newRole;
    return this.profileDataPort.save(profile);
  }

  public findByText(
    params: TextSearchableQueryParams
  ): Promise<TextSearchableQuery<Profile>> {
    return this.profileDataPort.findByText(params);
  }

  public findByEmail(email: string): Promise<Profile | undefined> {
    return this.profileDataPort.findByEmail(email);
  }

  public async verifyCredentials(
    email: string,
    password: string
  ): Promise<Profile | undefined> {
    const profile = await this.profileDataPort.findByEmail(email);
    if (!profile) return undefined;
    if (await profile.verifyPassword(password)) return profile;
    return undefined;
  }
}
