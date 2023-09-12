import { iPaginationOption } from '../input/pagination.input';
import { iOrderBy } from './order-by.interface';

export interface iListArgs<T> {
  pagination: iPaginationOption;
  order?: iOrderBy<T>;
}
