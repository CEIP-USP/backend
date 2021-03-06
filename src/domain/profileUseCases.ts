import { IDocument, Profile } from './profile';
import { IProfileDataPort } from './ports/profileDataPort';
import { Role } from './role';
import {
  TextSearchableQuery,
  TextSearchableQueryParams,
} from 'common/pagedQuery';
import joi from 'joi';
import { EmailAlreadyRegisteredError } from './exceptions/EmailAlreadyRegisteredError';
import { DocumentAlreadyRegisteredError } from './exceptions/DocumentAlreadyRegisteredError';
import { ProfileCredentials } from './profileCredentials';
import { ProfileNotFoundError } from './exceptions/ProfileNotFoundError';
import { ProfileChangingDto } from './dtos/profileChangingDto';

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

const preRegistrationSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required().min(8),
  hasSecondShot: joi.boolean().optional(),
  document: joi
    .object<IDocument>({
      type: joi.string().required(),
      value: joi.string().required(),
    })
    .required(),
  phone: joi.string().optional(),
  address: joi.string().optional(),
  dayOfSecondShot: joi.date().optional(),
});

export default class ProfileUseCases {
  constructor(private readonly profileDataPort: IProfileDataPort) {}

  public async performPreRegistration({
    name,
    email,
    password,
    hasSecondShot,
    document,
    phone,
    address,
    dayOfSecondShot,
  }: PreRegistrationData): Promise<Profile> {
    joi.assert(
      {
        name,
        email,
        password,
        document,
        phone,
        address,
        dayOfSecondShot,
      },
      preRegistrationSchema
    );

    if (await this.profileDataPort.findByEmail(email)) {
      throw new EmailAlreadyRegisteredError(email);
    }
    if (await this.profileDataPort.findByDocument(document)) {
      throw new DocumentAlreadyRegisteredError(document);
    }
    const profileCredentials = new ProfileCredentials(
      email,
      await ProfileCredentials.hashPassword(password)
    );
    const profile = await Profile.create(
      name,
      email,
      profileCredentials,
      hasSecondShot,
      document,
      phone,
      address,
      dayOfSecondShot
    );
    return this.profileDataPort.save(profile);
  }

  public async addRole(id: string, newRole: Role): Promise<Profile> {
    const profile = await this.profileDataPort.findById(id);
    if (!profile) throw new ProfileNotFoundError('id', id);

    profile.roles.push(newRole);
    return this.profileDataPort.save(profile);
  }

  public async removeRole(id: string, roleName: string): Promise<Profile> {
    const profile = await this.profileDataPort.findById(id);
    if (!profile) throw new ProfileNotFoundError('id', id);

    profile.roles = profile.roles.filter(
      (role: Role) => role.name !== roleName
    );
    return await this.profileDataPort.save(profile);
  }

  public findById(id: string): Promise<Profile | undefined> {
    return this.profileDataPort.findById(id);
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
    if (await profile.credentials.verifyPassword(password)) return profile;
    return undefined;
  }

  public async updatePassword(
    id: string,
    newPassword: string
  ): Promise<Profile> {
    const profile = await this.profileDataPort.findById(id);
    if (!profile) throw new Error('Profile not found');
    const hashedNewPassword = await ProfileCredentials.hashPassword(
      newPassword
    );
    profile.credentials.setPassword(hashedNewPassword);
    return this.profileDataPort.save(profile);
  }

  public async updateProfile(
    id: string,
    profileChanges: ProfileChangingDto
  ): Promise<Profile> {
    const profile = await this.profileDataPort.findById(id);
    if (!profile) throw new ProfileNotFoundError('id', id);

    const { name, email, document, phone, address, dayOfSecondShot } = profile;

    const newProfile = new Profile(
      profileChanges.name ? profileChanges.name : name,
      profileChanges.email ? profileChanges.email : email,
      profile.credentials,
      dayOfSecondShot ? true : false,
      profileChanges.document ? profileChanges.document : document,
      profileChanges.phone ? profileChanges.phone : phone,
      profileChanges.address ? profileChanges.address : address,
      profileChanges.dayOfSecondShot
        ? profileChanges.dayOfSecondShot
        : dayOfSecondShot,
      profile.roles,
      profile._id
    );

    return this.profileDataPort.save(newProfile);
  }

  public async deleteProfile(id: string): Promise<void> {
    const profile = await this.profileDataPort.findById(id);
    if (!profile) throw new ProfileNotFoundError('id', id);

    this.profileDataPort.delete(profile._id);
  }
}
