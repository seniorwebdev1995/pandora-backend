import { ArgsType, Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { CategoryId } from '../../category/category.model';
import { createPaginationArgs } from '../../pagination/pagination-args.graphql';
import { DealId } from '../deal.model';

enum ListDealInputSortFields {
  name = 'name',
  createdAt = 'createdAt',
}

registerEnumType(ListDealInputSortFields, {
  name: 'ListDealInputSortFields',
});

@InputType()
export class ListDealFilterInputDto {
  @Field(() => [String], { nullable: true, description: 'Category ID with one of thoses Ids' })
  @IsString()
  @IsOptional()
  categoriesIds?: CategoryId[];

  @Field(() => [String], { nullable: true, description: 'Deals ID should be one of those' })
  @IsOptional()
  @IsString()
  ids?: DealId[];
}

@ArgsType()
@InputType()
export class ListDealInput extends createPaginationArgs(ListDealInputSortFields) {
  @Field(() => ListDealFilterInputDto, { nullable: true })
  filter: ListDealFilterInputDto;
}
