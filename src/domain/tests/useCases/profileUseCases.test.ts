import { isRegExp } from 'util/types';
import { IProfileDataPort } from '../../ports/profileDataPort';
import ProfileUseCases from '../../profileUseCases';
import { Role } from '../../role';
import profileMock from '../mocks/profileMock';

describe(ProfileUseCases, () => {
  const profileDataPort: IProfileDataPort = {
    findById: jest.fn(() => Promise.resolve(profileMock())),
    save: jest.fn(),
    findByEmail: jest.fn(),
    findByText: jest.fn(),
  };
  const profileUseCases = new ProfileUseCases(profileDataPort);
  describe('update roles', () => {
    it('should add a role to profile', async () => {
      const id = '1234-5678';
      const role = new Role('Supervisor');
      const expected = profileMock();
      expected.roles.push(role);
      (profileDataPort.save as jest.Mock).mockResolvedValueOnce(expected);

      const profile = await profileUseCases.addRole(id, role);

      expect(profile.roles).toEqual([new Role('User'), new Role('Supervisor')]);
    });
  });
});
