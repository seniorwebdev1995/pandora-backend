import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { UserId } from '../model/user.model';

@InputType()
export class ListUserFilterInputDto {
  @Field(() => String, { nullable: true, description: 'User email contain this' })
  @IsOptional()
  @IsString()
  email?: string;

  @Field(() => [String], { nullable: true, description: 'User with one of these ids' })
  @IsOptional()
  @IsString()
  ids?: UserId[];

  createdMinDate?: Date;
  createdMaxDate?: Date;
}
