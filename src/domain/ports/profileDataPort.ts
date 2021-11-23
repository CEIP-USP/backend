import {
  TextSearchableQuery,
  TextSearchableQueryParams,
} from 'common/pagedQuery';

import { Profile } from '../profile';

export interface IProfileDataPort {
  findById: (_id: string) => Promise<Profile>;
  save: (profile: Profile) => Promise<Profile>;
  findByText: (
    params: TextSearchableQueryParams
  ) => Promise<TextSearchableQuery<Profile>>;
  findByEmail(email: string): Promise<Profile | undefined>;
}
