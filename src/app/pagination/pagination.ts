import { Query, SortOrder } from 'mongoose';

export type Doc = object;

type ExcludeUndefinedValues<T extends object> = {
  [key in keyof T]: Exclude<T[key], undefined>;
};

export type SortObject<D extends Doc> = ExcludeUndefinedValues<{
  [key in string & keyof D]?: SortOrder;
}>;

export interface MongoPagination<D extends Doc> {
  limit?: number;
  skip?: number;
  sort?: SortObject<D>;
}

export const paginateQuery = <D extends Doc, Q extends Query<D[], D> = Query<D[], D>>(
  query: Q,
  pagination: MongoPagination<D> | undefined,
): Q => {
  if (pagination?.skip) {
    query = query.skip(pagination.skip);
  }
  if (pagination?.limit) {
    query = query.limit(pagination.limit);
  }
  if (pagination?.sort) {
    query = query.sort(pagination.sort);
  }
  return query;
};
