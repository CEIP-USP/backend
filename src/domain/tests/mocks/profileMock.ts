import { Role } from '../../role';
import { Profile } from '../../profile';
import { ProfileCredentials } from '../../profileCredentials';

const profileMock = (): Profile =>
  new Profile(
    'Susan',
    'pearline_hin@hotmail.com',
    new ProfileCredentials('pearline_hin@hotmail.com', 'h45h3d'),
    true,
    {
      type: 'cpf',
      value: '12043451690',
    },
    undefined,
    undefined,
    new Date(2021, 1, 31),
    [new Role('Usuario')]
  );

export default profileMock;
