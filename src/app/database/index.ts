import { Db, MongoClient } from 'mongodb';

export default async (dbName = 'CEIP'): Promise<Db | undefined> => {
  const url = process.env.MONGO_URL || 'mongodb://db:27017/';
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log('Database connected');
    return client.db(dbName);
  } catch (e) {
    console.log((e as Error).message);
  }
};
