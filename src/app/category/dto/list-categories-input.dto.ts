import { ArgsType, Field, InputType, registerEnumType } from '@nestjs/graphql';
import { createPaginationArgs } from '../../pagination/pagination-args.graphql';
import { CategoryId } from '../category.model';

export enum ListCategoriesInputSortFields {
  createdAt = 'createdAt',
}

registerEnumType(ListCategoriesInputSortFields, {
  name: 'ListCategoriesInputSortFields',
});

@InputType()
export class LisCategoriesFilterInputDto {
  @Field(() => [String], { nullable: true, description: 'Categorieds should be one of these ids' })
  ids?: CategoryId[];
}

@ArgsType()
@InputType()
export class ListCategoriesQueryArgs extends createPaginationArgs(ListCategoriesInputSortFields) {
  @Field(() => LisCategoriesFilterInputDto, { nullable: true })
  filter: LisCategoriesFilterInputDto;
}
