import { ArgsType, Field, InputType, ReturnTypeFunc } from '@nestjs/graphql';
import { Direction } from './enums/direction.enum';
import { PaginationOption } from './input/pagination.input';
import { iListArgs } from './interfaces/list-args.interface';
import { iOrderBy } from './interfaces/order-by.interface';

type ListArgsConstructor<T> = new (...args: any[]) => iListArgs<T>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ListArgsFactory<T extends ReturnTypeFunc>(
  listOfFields: T,
  name: string,
): ListArgsConstructor<T> {
  @InputType(name + 'OrderBy', { isAbstract: true })
  abstract class OrderBy<T> implements iOrderBy<T> {
    @Field(listOfFields, { nullable: true })
    field: T;

    @Field(() => Direction, { nullable: true })
    direction: Direction;
  }

  @ArgsType()
  @InputType()
  class ListArgs implements iListArgs<T> {
    @Field(() => PaginationOption, { nullable: false })
    pagination: PaginationOption;

    @Field(() => OrderBy, { nullable: true })
    order?: OrderBy<T>;
  }

  return ListArgs;
}
