import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { iEdge } from '../interfaces/edge.interface';
import { iPage } from '../interfaces/page.interface';
import { PageInfo } from './page-info.type';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Page<T>(ItemType: Type<T>, name?: string): any {
  @ObjectType(`Paginated${name || ItemType.name}Edge`)
  abstract class EdgeClass implements iEdge<T> {
    @Field(() => String, { nullable: true })
    cursor: string;

    @Field(() => ItemType, { nullable: true })
    node: T;
  }

  @ObjectType({ isAbstract: true })
  abstract class PageClass implements iPage<T> {
    @Field(() => PageInfo, { nullable: true })
    pageInfo: PageInfo;

    @Field(() => Int)
    totalCount: number;

    @Field(() => [EdgeClass], { nullable: 'items' })
    edges: EdgeClass[];
  }

  return PageClass;
}
