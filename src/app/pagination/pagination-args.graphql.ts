import { Type } from '@nestjs/common';
import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';
import { UserInputError } from 'apollo-server-express';
import { isNumber } from 'lodash';
import { SortOrder } from 'mongoose';
import { Direction } from './models/enums/direction.enum';
import { MongoPagination, SortObject } from './pagination';

export interface PaginationArgs<SortField extends string> {
  page?: number;
  perPage?: number;
  sortField?: SortField;
  sortDirection?: Direction;
}

type Enum = Record<string, string>;

export const createPaginationArgs = <SortFieldsEnum extends Enum>(
  sortFieldsEnum: SortFieldsEnum,
): Type<PaginationArgs<SortFieldsEnum[keyof SortFieldsEnum]>> => {
  @ArgsType()
  class PaginationArgsClass {
    @Field(() => Int, { nullable: true })
    page?: number;

    @Field(() => Int, { nullable: true })
    perPage?: number;

    @Field(() => sortFieldsEnum, { nullable: true })
    sortField?: SortFieldsEnum[keyof SortFieldsEnum];

    @Field(() => Direction, { nullable: true })
    sortOrder?: Direction;
  }
  return PaginationArgsClass;
};

@ObjectType()
export class ListMetadata {
  @Field(() => Int)
  count!: number;

  constructor(count: number) {
    this.count = count;
  }
}

const sortOrderToMongoSortDirection = (direction: Direction): SortOrder =>
  direction === Direction.Desc ? -1 : 1;

interface GraphQlPaginationOptions {
  defaultLimit?: number;
  maxLimit?: number;
}

export const graphqlToMongoPagination = <SortField extends string>(
  args?: PaginationArgs<SortField>,
  { defaultLimit, maxLimit }: GraphQlPaginationOptions = {},
): MongoPagination<{ [key in SortField]: unknown }> | undefined => {
  if (!args) {
    return undefined;
  }
  const limit = args.perPage || defaultLimit;
  if (isNumber(limit) && isNumber(maxLimit) && limit > maxLimit) {
    throw new UserInputError(`Limit (${limit}) over max limit (${maxLimit})`);
  }
  return {
    skip: (args.page || 0) * (limit || 1),
    limit,
    ...(args.sortField
      ? {
          sort: {
            [args.sortField]: args.sortDirection
              ? sortOrderToMongoSortDirection(args.sortDirection)
              : 1,
          } as SortObject<{ [key in SortField]: unknown }>,
        }
      : {}),
  };
};
