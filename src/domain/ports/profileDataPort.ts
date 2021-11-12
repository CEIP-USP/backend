import { Profile } from '../profile';

export interface IProfileDataPort {
  findById: (_id: string) => Promise<Profile>;
  save: (profile: Profile) => Promise<Profile>;
}
