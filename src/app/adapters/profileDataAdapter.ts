import { IProfileDataPort } from 'domain/ports/profileDataPort';
import { Profile } from 'domain/profile';
import { Collection, Db, Document } from 'mongodb';

const documentToProfile = ({
  name,
  email,
  password,
  hasSecondShot,
  document,
  phone,
  address,
  dayOfSecondShot,
}: Document) => {
  return new Profile(
    name,
    email,
    password,
    hasSecondShot,
    document,
    phone,
    address,
    dayOfSecondShot
  );
};

export class ProfileDataAdapter implements IProfileDataPort {
  private profileCollection: Collection;
  constructor(database: Db) {
    this.profileCollection = database.collection('profiles');
  }

  async findById(id: string): Promise<Profile | undefined> {
    const profile = await this.profileCollection.findOne({ uuid: id });

    if (!profile) return undefined;

    const {
      name,
      email,
      password,
      hasSecondShot,
      documet,
      phone,
      address,
      dayOfSecondShot,
    } = profile;

    return new Profile(
      name,
      email,
      password,
      hasSecondShot,
      documet,
      phone,
      address,
      dayOfSecondShot
    );
  }

  async update(profile: Profile): Promise<Profile> {
    await this.profileCollection.updateOne({ uuid: profile.id }, profile);
    return (await this.findById(profile.id)) as Profile;
  }

  async save(profile: Profile): Promise<Profile> {
    const result = await this.profileCollection.insertOne(profile);
    const savedProfile: Document | null = await this.profileCollection.findOne({
      _id: result.insertedId,
    });
    return documentToProfile(savedProfile as Document);
  }
}
