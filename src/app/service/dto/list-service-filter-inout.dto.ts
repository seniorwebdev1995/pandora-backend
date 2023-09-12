import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { CategoryId } from '../../category/category.model';
import { ServiceId } from '../service.model';

@InputType()
export class ListServiceFilterInputDto {
  @Field(() => String, { nullable: true, description: 'Service ID should be this' })
  @IsOptional()
  @IsString()
  id?: ServiceId;

  @Field(() => [String], { nullable: true, description: 'Service ID with one of thoses Ids' })
  @IsString()
  @IsOptional()
  categoriesIds?: CategoryId[];

  deleted?: boolean;

  @Field(() => [String], { nullable: true, description: 'Service ID should be one of those' })
  @IsOptional()
  @IsString()
  ids?: ServiceId[];
}
