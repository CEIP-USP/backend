import { Profile } from '../../profile';

const profileMock = (): Profile =>
  new Profile(
    'Susan',
    'pearline_hin@hotmail.com',
    '1234',
    true,
    {
      type: 'cpf',
      value: '12043451690',
    },
    undefined,
    undefined,
    new Date(2021, 1, 31)
  );

export default profileMock;
