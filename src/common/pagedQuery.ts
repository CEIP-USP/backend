export type PagedQueryParams = {
  skip: number;
  take: number;
};

export type PagedQuery<T> = PagedQueryParams & {
  data: T[];
};

export type TextSearchableQueryParams = PagedQueryParams & {
  q: string;
};

export type TextSearchableQuery<T> = PagedQuery<T> & {
  q: string;
};
