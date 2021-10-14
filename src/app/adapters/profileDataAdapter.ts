import {
  TextSearchableQueryParams,
  TextSearchableQuery,
} from 'common/pagedQuery';
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
  findByText: (
    params: TextSearchableQueryParams
  ) => Promise<TextSearchableQuery<Profile>> = () => {
    throw new Error('Method not implemented.');
  };

  save = async (profile: Profile): Promise<Profile> => {
    const result = await this.profileCollection.insertOne(profile);
    const savedProfile: Document | null = await this.profileCollection.findOne({
      _id: result.insertedId,
    });
    return documentToProfile(savedProfile as Document);
  };
}
