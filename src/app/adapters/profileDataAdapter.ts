import { IProfileDataPort } from '../../domain/ports/profileDataPort';
import { Profile } from '../../domain/profile';
import { Collection, Db, Document } from 'mongodb';
import {
  TextSearchableQuery,
  TextSearchableQueryParams,
} from '../../common/pagedQuery';

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

  save = async (profile: Profile): Promise<Profile> => {
    const result = await this.profileCollection.insertOne(profile);
    const savedProfile: Document | null = await this.profileCollection.findOne({
      _id: result.insertedId,
    });
    return documentToProfile(savedProfile as Document);
  };

  async findByText(
    params: TextSearchableQueryParams
  ): Promise<TextSearchableQuery<Profile>> {
    const result = await this.profileCollection
      .find(
        {
          name: {
            $regex: params.q,
          },
        },
        { skip: params.skip, limit: params.take }
      )
      .map(documentToProfile)
      .toArray();

    return {
      ...params,
      data: result,
    };
  }

  async findByEmail(email: string): Promise<Profile | undefined> {
    const data = await this.profileCollection.findOne({
      email: {
        $eq: email,
      },
    });
    return (data && documentToProfile(data)) || undefined;
  }
}
