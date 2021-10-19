import { IProfileDataPort } from './ports/profileDataPort';
import { Contact, Profile } from './profile';
import { Role, RoleType } from './role';

export interface PreRegistrationData {
  name: string;
  cpf?: string;
  contact: Contact;
  dayOfSecondShot?: Date;
}

export default class ProfileUseCases {
  constructor(private readonly profileDataPort: IProfileDataPort) {}

  public performPreRegistration({
    name,
    cpf,
    contact,
    dayOfSecondShot,
  }: PreRegistrationData): Promise<Profile> {
    return this.profileDataPort.save(
      new Profile(name, cpf, contact, dayOfSecondShot || null)
    );
  }

  public async updateRole(id: string, newRole: RoleType): Promise<Profile> {
    const profile = await this.profileDataPort.findById(id);
    profile.role = new Role(newRole);
    return this.profileDataPort.save(profile);
  }
}
