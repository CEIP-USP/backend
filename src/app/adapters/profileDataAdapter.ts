import { IProfileDataPort } from 'domain/ports/profileDataPort';
import { Profile } from 'domain/profile';
import { Collection, Db, Document } from 'mongodb';
import { ObjectId } from 'bson';

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

    if (queriedProfile) return this.update(queriedProfile, profile);
    const result = await this.profileCollection.insertOne(profile);
    const savedProfile: Document | null = await this.profileCollection.findOne({
      _id: result.insertedId,
    });
    return documentToProfile(savedProfile as Document);
  };

  findById = async (_id: string): Promise<Profile> => {
    console.log(new ObjectId(_id));
    console.log(new ObjectId(_id));
    const profile: Document | null = await this.profileCollection.findOne({
      _id: new ObjectId(_id),
    });
    return documentToProfile(profile as Document);
  };

  private async update(
    savedProfile: Document,
    profile: Profile
  ): Promise<Profile> {
    const updatedProfile = this.profileCollection.updateOne(
      { _id: savedProfile._id },
      { $set: { "role" } }
    );

    return documentToProfile(updatedProfile as Document);
  }
}
