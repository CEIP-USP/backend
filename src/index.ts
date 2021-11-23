import { ProfileController } from 'app/controllers/profile.controller';
import ProfileUseCases from 'domain/profileUseCases';
import setupDb from 'app/database';
import { ProfileDataAdapter } from 'app/adapters/profileDataAdapter';
import { Db } from 'mongodb';
import { setupAPI } from 'app/api';

async function main() {
  try {
    const db = await setupDb();

    const profileDataAdapter = new ProfileDataAdapter(db as Db);

    const profileUseCases = new ProfileUseCases(profileDataAdapter);

    const controller = new ProfileController(profileUseCases);

    const app = setupAPI(controller);

    app.listen(process.env.PORT, () => {
      console.log(`Server Running on ${process.env.PORT}!`);
    });
  } catch (e) {
    console.error(e);
  }
}

main();
