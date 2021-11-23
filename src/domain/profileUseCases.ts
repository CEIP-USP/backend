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
  constructor(private readonly profileDataPort: IProfileDataPort) { }

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

  public async updateProfile(
    id: string,
    updates: Partial<PreRegistrationData>
  ): Promise<any> {
    const profile: Profile | undefined = await this.profileDataPort.findById(
      id
    );

    if (!profile) {
      return Promise.reject(`Profile ${id} not found`);
    }

    const updated = this._updateProfile(profile, updates);

    return await this.profileDataPort.update(updated);
  }

  // TODO: need improvement
  // issue: when updates = { bunda: 'suja'}, it'll go to the BD
  // suggestion: create a DTO class --> this exists in runtime
  private _updateProfile(
    original: Profile,
    updates: Partial<PreRegistrationData>
  ): any {
    return {
      ...original,
      ...updates,
    };
  }
}
