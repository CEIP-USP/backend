import { Profile } from '../profile';
import { InvalidSecondShotDateError } from '../exceptions/InvalidSecondShotDateError';

describe('Profile', () => {
  describe('Day of second shot validation', () => {
    const instantiateProfile = (date: Date) =>
      new Profile(
        'John Doe',
        'john.doe@gmail.com',
        '@BlaBlaBla123',
        true,
        { type: 'cpf', value: '123.456.789-00' },
        '12345678900',
        'Rua Bla Bla, 123',
        date,
        undefined,
        undefined
      );

    test('true negative', () => {
      const futureDate = new Date(
        new Date().getTime() + 1000 * 60 * 60 * 24 * 21
      );
      expect(() => instantiateProfile(futureDate)).toThrowError(
        InvalidSecondShotDateError
      );
    });

    test('true positive', () => {
      const pastDate = new Date(
        new Date().getTime() - 1000 * 60 * 60 * 24 * 21
      );
      expect(() => instantiateProfile(pastDate)).not.toThrow();
    });
  });
});
