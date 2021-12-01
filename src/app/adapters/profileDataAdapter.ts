import { IProfileDataPort } from '../../domain/ports/profileDataPort';
import { IDocument, Profile } from '../../domain/profile';
import { Collection, Db, Document } from 'mongodb';
import {
  TextSearchableQuery,
  TextSearchableQueryParams,
} from '../../common/pagedQuery';
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
    name,
    email,
    password,
    hasSecondShot,
    document,
    phone,
    address,
    dayOfSecondShot,
    role,
    _id
  );
};

export class ProfileDataAdapter implements IProfileDataPort {
  private profileCollection: Collection;

  constructor(database: Db) {
    this.profileCollection = database.collection(
      process.env.PROFILE_COLLECTION + ''
    );
  }

  findByDocument(document: IDocument): Promise<Profile | undefined> {
    return this.profileCollection
      .findOne({
        document: {
          type: document.type,
          value: document.value,
        },
      })
      .then(
        (profile) => (!!profile && documentToProfile(profile)) || undefined
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

  findById = async (_id: string): Promise<Profile> => {
    const profile: Document | null = await this.profileCollection.findOne({
      _id: new ObjectId(_id),
    });
    return documentToProfile(profile as Document);
  };

  private async update(
    savedProfile: Document,
    profile: Profile
  ): Promise<ObjectId> {
    await this.profileCollection.replaceOne(
      {
        _id: savedProfile._id,
      },
      profile
    );

    return profile._id;
  }
}
