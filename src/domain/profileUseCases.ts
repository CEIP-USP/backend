import { IDocument, Profile } from './profile';
import { IProfileDataPort } from './ports/profileDataPort';
import { Role } from './role';
import {
  TextSearchableQuery,
  TextSearchableQueryParams,
} from 'common/pagedQuery';
import joi from 'joi';
import { ObjectId } from 'bson';
import { EmailAlreadyRegisteredError } from './exceptions/EmailAlreadyRegisteredError';
import { DocumentAlreadyRegisteredError } from './exceptions/DocumentAlreadyRegisteredError';

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

    const profile = new Profile(
      name,
      email,
      password,
      hasSecondShot,
      document,
      phone,
      address,
      dayOfSecondShot,
      undefined,
      new ObjectId()
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
