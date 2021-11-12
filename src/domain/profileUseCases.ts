import { IProfileDataPort } from './ports/profileDataPort';
import { Role } from './role';
import { IDocument, Profile } from './profile';
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
    console.log(profile._id);
    profile.role = newRole;
    return this.profileDataPort.save(profile);
  }
}
