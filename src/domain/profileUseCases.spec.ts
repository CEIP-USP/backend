import { IProfileDataPort } from './ports/profileDataPort';
import { Profile } from './profile';
import ProfileUseCases from './profileUseCases';

function generateMockDataPort(): IProfileDataPort {
  return {
    save: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
  };
}

describe(ProfileUseCases, () => {
  describe('updateProfile', () => {
    let usecase: ProfileUseCases;
    let mockDataPort: IProfileDataPort;
    let id: string;

    beforeEach(async () => {
      mockDataPort = generateMockDataPort();
      usecase = new ProfileUseCases(mockDataPort);
      id = 'mocked id';
    });

    it('finds the given profile', async () => {
      (mockDataPort.findById as jest.Mock).mockResolvedValueOnce(true);
      await usecase.updateProfile(id, { password: '123456' });
      expect(mockDataPort.findById).toHaveBeenCalledWith(id);
    });

    describe('when no Profile is found', () => {
      beforeEach(() => {
        (mockDataPort.findById as jest.Mock).mockResolvedValueOnce(undefined);
      });

      it('throws an exception', () => {
        expect(() => usecase.updateProfile('foo', {})).rejects.toMatch(
          'not found'
        );
      });
    });

    describe('when a Profile is found', () => {
      let profile: Profile;
      beforeEach(async () => {
        profile = new Profile(
          'foo',
          'foo@mail.com',
          'abcdef',
          true,
          {
            type: 'undocumented',
          },
          undefined,
          undefined,
          new Date(2021, 9, 10)
        );
        (mockDataPort.findById as jest.Mock).mockResolvedValueOnce(profile);

        await usecase.updateProfile('mock id', { password: 'foo' });
      });

      it('calls dataPort.update', () => {
        const expected = Object.assign({}, profile);
        expected.password = 'foo';
        expect(mockDataPort.update).toHaveBeenCalledWith(expected);
      });
    });
  });
});
