import {
  TextSearchableQuery,
  TextSearchableQueryParams,
} from 'common/pagedQuery';

import { IDocument, Profile } from '../profile';

export interface IProfileDataPort {
  save: (profile: Profile) => Promise<Profile>;
  findByText: (
    params: TextSearchableQueryParams
  ) => Promise<TextSearchableQuery<Profile>>;
  findById: (_id: string) => Promise<Profile | undefined>;
  findByEmail: (email: string) => Promise<Profile | undefined>;
  findByDocument: (document: IDocument) => Promise<Profile | undefined>;
}
