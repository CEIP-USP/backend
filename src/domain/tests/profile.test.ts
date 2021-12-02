import { Profile } from '../profile';
import { InvalidSecondShotDateError } from '../exceptions/InvalidSecondShotDateError';

describe('Profile', () => {
  describe('Day of second shot validation', () => {
    const instantiateProfile = (date: Date) =>
      Profile.create(
        'John Doe',
        'john.doe@gmail.com',
        '@BlaBlaBla123',
        true,
        { type: 'cpf', value: '123.456.789-00' },
        '12345678900',
        'Rua Bla Bla, 123',
        date,
        undefined
      );

    test('true negative', async () => {
      const futureDate = new Date(
        new Date().getTime() + 1000 * 60 * 60 * 24 * 21
      );
      await expect(() => instantiateProfile(futureDate)).rejects.toThrowError(
        InvalidSecondShotDateError
      );
    });

    test('true positive', async () => {
      const pastDate = new Date(
        new Date().getTime() - 1000 * 60 * 60 * 24 * 21
      );
      await expect(() => instantiateProfile(pastDate)).resolves;
    });
  });
});
