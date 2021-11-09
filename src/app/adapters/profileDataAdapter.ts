import { IProfileDataPort } from 'domain/ports/profileDataPort';
import { Profile } from 'domain/profile';
import { Collection, Db, Document } from 'mongodb';

const documentToProfile = ({
  id,
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
    id,
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
    this.profileCollection = database.collection(
      process.env.PROFILE_COLLECTION as string
    );
  }

  save = async (profile: Profile): Promise<Profile> => {
    const result = await this.profileCollection.insertOne(profile);
    const savedProfile: Document | null = await this.profileCollection.findOne({
      _id: result.insertedId,
    });
    return documentToProfile(savedProfile as Document);
  };

  findById = async (_id: string): Promise<Profile> => {
    const profile: Document | null = await this.profileCollection.findOne({
      _id,
    });
    return documentToProfile(profile as Document);
  };
}
