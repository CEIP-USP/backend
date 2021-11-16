import { Profile } from '../profile';

export interface IProfileDataPort {
  save: (profile: Profile) => Promise<Profile>;
  findById: (id: string) => Promise<Profile | undefined>;
  update: (profile: Profile) => Promise<Profile>;
}
