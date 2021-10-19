import { Profile } from '../profile';

export interface IProfileDataPort {
  findById: (id: string) => Promise<Profile>;
  save: (profile: Profile) => Promise<Profile>;
}
