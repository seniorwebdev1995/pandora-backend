import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsOptional, MaxLength } from 'class-validator';
import { DealId } from '../../deal/deal.model';
import { UserId } from '../../user/model/user.model';
import { ListEventsPossible } from '../types';

@ArgsType()
@InputType()
export class PushEventInputDto {
  @Field(() => ListEventsPossible, { nullable: false })
  key: ListEventsPossible;

  @IsOptional()
  @MaxLength(50)
  @Field(() => String, { nullable: true })
  userId?: UserId;

  @IsOptional()
  @MaxLength(50)
  @Field(() => String, { nullable: true })
  dealId?: DealId;

  @IsOptional()
  @MaxLength(500)
  @Field(() => String, { nullable: true })
  extra?: string;
}
