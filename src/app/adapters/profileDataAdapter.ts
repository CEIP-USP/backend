import { IProfileDataPort } from '../../domain/ports/profileDataPort';
import { Profile } from '../../domain/profile';
import { Collection, Db, Document } from 'mongodb';
import { ObjectID, ObjectId } from 'bson';

const documentToProfile = ({
  _id,
  name,
  email,
  password,
  hasSecondShot,
  document,
  phone,
  address,
  dayOfSecondShot,
  role,
}: Document) => {
  return new Profile(
    _id,
    name,
    email,
    password,
    hasSecondShot,
    document,
    phone,
    address,
    dayOfSecondShot,
    role
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
    const queriedProfile: Document | null =
      await this.profileCollection.findOne({
        _id: profile._id,
      });

    const _id = queriedProfile
      ? await this.update(queriedProfile, profile)
      : (await this.profileCollection.insertOne(profile)).insertedId;

    const savedProfile: Document | null = await this.profileCollection.findOne({
      _id,
    });
    return documentToProfile(savedProfile as Document);
  };

  findById = async (_id: string): Promise<Profile> => {
    const profile: Document | null = await this.profileCollection.findOne({
      _id: new ObjectId(_id),
    });
    return documentToProfile(profile as Document);
  };

  private async update(
    savedProfile: Document,
    profile: Profile
  ): Promise<ObjectID> {
    await this.profileCollection.replaceOne(
      {
        _id: savedProfile._id,
      },
      profile
    );

    return profile._id;
  }
}
