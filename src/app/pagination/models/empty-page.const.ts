import { b64zero } from '../../helpers/strings.tools';
import { iPage } from './interfaces/page.interface';

export const EMPTY_PAGE: iPage<never> = {
  totalCount: 0,
  edges: [],
  pageInfo: {
    endCursor: b64zero,
    startCursor: b64zero,
    hasPrevPage: false,
    hasNextPage: false,
  },
};
