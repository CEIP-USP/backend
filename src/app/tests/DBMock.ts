import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Extend the default timeout so MongoDB binaries can download
jest.setTimeout(60000);

export default class DBMock {
  private client: MongoClient | undefined;
  private server: MongoMemoryServer | undefined;

  constructor(public db: Db | undefined = undefined) {}

  async start(): Promise<Db> {
    this.server = await MongoMemoryServer.create();
    const url = this.server.getUri();
    this.client = new MongoClient(url);
    await this.client.connect();
    return this.client.db(process.env.DBNAME || 'CEIP');
  }

  stop(): Promise<boolean> {
    if (this.client) this.client.close();
    if (this.server) return this.server.stop();
    return Promise.resolve(true);
  }

  cleanup(usedCollections: string[]): Promise<unknown[]> {
    return Promise.all(
      usedCollections.map((c) => {
        if (this.db) this.db.collection(c).drop();
      })
    );
  }
}
