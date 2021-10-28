import { ProfileEntity } from 'app/entities/ProfileEntity';
import { IProfileDataPort } from 'domain/ports/profileDataPort';
import { Profile } from 'domain/profile';
import { Collection, Db } from 'mongodb';

// const profileFromEntity = (
//   entity: Promise<ProfileEntity>
// ): Promise<Profile> => {
//   entity;
// };

export class ProfileDataAdapter implements IProfileDataPort {
  private profileCollection: Collection<Document>;
  constructor(database: Db) {
    this.profileCollection = database.collection('pre-register');
  }

  save = async (profile: Profile): Promise<Profile> => {
    const result = await this.profileCollection.insertOne(profile);
    return (await this.profileCollection.findOne({
      _id: result.insertedId,
    })) as unknown as Profile;
  };
}
