import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { DealId } from '../../deal/deal.model';

@ArgsType()
@InputType()
export class RedeemOrderInput {
  @IsOptional()
  @Field({ nullable: true })
  collectionFound?: string;

  @IsString()
  @Field({ nullable: false })
  dealId: DealId;
}
