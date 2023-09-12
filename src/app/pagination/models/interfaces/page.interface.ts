import { iEdge } from './edge.interface';

export interface iPage<T> {
  totalCount: number;
  edges: iEdge<T>[];
  pageInfo: {
    startCursor: string;
    endCursor: string;
    hasPrevPage: boolean;
    hasNextPage: boolean;
  };
}
