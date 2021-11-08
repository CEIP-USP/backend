import { IProfileDataPort } from './ports/profileDataPort';
import { Role, RoleType } from './role';
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

  public async updateRole(id: string, newRole: RoleType): Promise<Profile> {
    const profile = await this.profileDataPort.findById(id);
    profile.role = new Role(newRole);
    return this.profileDataPort.save(profile);
  }
}
