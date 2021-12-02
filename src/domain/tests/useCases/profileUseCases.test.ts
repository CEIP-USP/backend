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
    findByDocument: jest.fn(),
  };
  const profileUseCases = new ProfileUseCases(profileDataPort);

  beforeEach(() => {
    (profileDataPort.save as jest.Mock).mockReset();
  });

  describe('add roles', () => {
    it('should add a role to profile', async () => {
      const id = '1234-5678';
      const role = new Role('Supervisor');
      const expected = profileMock();

      (profileDataPort.findById as jest.Mock).mockResolvedValueOnce(expected);

      await profileUseCases.addRole(id, role);

      expect(
        (profileDataPort.save as jest.Mock).mock.calls[0][0].roles
      ).toEqual([new Role('User'), role]);
    });
  });

  describe('remove role', () => {
    it('should remove a role from profile', async () => {
      const id = '1234-5678';
      const roleName = 'Supervisor';
      const expected = profileMock();
      expected.roles.push(new Role(roleName));

      (profileDataPort.findById as jest.Mock).mockResolvedValueOnce(expected);

      await profileUseCases.removeRole(id, roleName);

      expect(
        (profileDataPort.save as jest.Mock).mock.calls[0][0].roles
      ).toEqual([new Role('User')]);
    });
  });
});
