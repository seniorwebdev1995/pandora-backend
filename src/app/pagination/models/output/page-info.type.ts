import { Field, ObjectType } from '@nestjs/graphql';

export interface iPageInfo {
  startCursor: string;
  endCursor: string;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}

@ObjectType()
export class PageInfo implements iPageInfo {
  @Field({ nullable: true })
  startCursor: string;

  @Field({ nullable: true })
  endCursor: string;

  @Field({ nullable: true })
  hasPrevPage: boolean;

  @Field({ nullable: true })
  hasNextPage: boolean;
}
