import {
  TextSearchableQuery,
  TextSearchableQueryParams,
} from 'common/pagedQuery';

import { Profile } from '../profile';

export interface IProfileDataPort {
  save: (profile: Profile) => Promise<Profile>;
  findByText: (
    params: TextSearchableQueryParams
  ) => Promise<TextSearchableQuery<Profile>>;
}
