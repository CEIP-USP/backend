import { IProfileDataPort } from '../../domain/ports/profileDataPort';
import { IDocument, Profile } from '../../domain/profile';
import { Collection, Db, Document } from 'mongodb';
import {
  TextSearchableQuery,
  TextSearchableQueryParams,
} from '../../common/pagedQuery';
import { ObjectId } from 'bson';
import { ProfileCredentials } from '../../domain/profileCredentials';

const documentToProfile = ({
  _id,
  name,
  email,
  credentials: { password },
  hasSecondShot,
  document,
  phone,
  address,
  dayOfSecondShot,
  roles,
}: Document) => {
  return new Profile(
    name,
    email,
    new ProfileCredentials(email, password),
    hasSecondShot,
    document,
    phone,
    address,
    dayOfSecondShot,
    roles,
    _id
  );
};

export class ProfileDataAdapter implements IProfileDataPort {
  private profileCollection: Collection;

  constructor(database: Db) {
    this.profileCollection = database.collection(
      process.env.PROFILE_COLLECTION || 'profiles'
    );
  }

  async findByDocument(document: IDocument): Promise<Profile | undefined> {
    const result = await this.profileCollection.findOne({
      document: {
        type: document.type,
        value: document.value,
      },
    });
    if (!result) return undefined;
    return documentToProfile(result);
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

  delete = async (_id: ObjectId): Promise<void> => {
    await this.profileCollection.deleteOne({ _id });
  };

  async findByText(
    params: TextSearchableQueryParams
  ): Promise<TextSearchableQuery<Profile>> {
    const textParam = params.q.trim();
    const filter: any = {};
    if (textParam) filter['$text'] = { $search: textParam };

    const result = await this.profileCollection
      .find(filter, { skip: params.skip, limit: params.take })
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

  findById = async (_id: string): Promise<Profile | undefined> => {
    let idObject: ObjectId;
    try {
      idObject = new ObjectId(_id);
    } catch (e) {
      return undefined;
    }

    const profile: Document | null = await this.profileCollection.findOne({
      _id: idObject,
    });
    if (!profile) return undefined;
    return documentToProfile(profile);
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
