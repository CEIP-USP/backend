import { Collection, Db, ObjectId } from 'mongodb';
import { ProfileDataAdapter } from '../../adapters/profileDataAdapter';
import DBMock from '../DBMock';

const profileCollectionName = process.env.PROFILE_COLLECTION || 'profiles';

describe(ProfileDataAdapter, () => {
  let profileDataAdapter: ProfileDataAdapter;

  const dbMock = new DBMock();

  let db: Db;
  beforeAll(async () => {
    db = await dbMock.start();
    profileDataAdapter = new ProfileDataAdapter(db);
  });

  beforeEach(async () => {
    await dbMock.cleanup([profileCollectionName]);
  });

  afterAll(() => {
    dbMock.stop();
  });

  describe('delete profile', () => {
    let profilesCollection: Collection;
    const _id = new ObjectId('61aeb66c3708fa247a45f1ff');

    beforeEach(async () => {
      profilesCollection = db.collection(profileCollectionName);
      await profilesCollection.insertOne({
        name: 'John Doe',
        email: 'john.oe13@gmail.com',
        password: '12345678',
        document: {
          type: 'cpf',
          value: '513.763.311-36',
        },
        phone: '11 91234-5678',
        address: 'R. do Matão, 1010 - Butantã, São Paulo - SP, 05508-090',
        dayOfSecondShot: '2021-10-14T22:24:24.294Z',
        _id,
        services: [],
        responsibleForValidation: '',
        roles: [
          {
            name: 'Supervisor',
          },
        ],
        vaccineStatus: {},
      });
    });

    it('should delete profile', async () => {
      await profileDataAdapter.delete(_id);

      const profileArray = await profilesCollection.find().toArray();
      expect(profileArray.length).toEqual(0);
    });
  });
});
