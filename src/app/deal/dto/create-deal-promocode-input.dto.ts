import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';
import { CreateDealInputDto } from './create-deal-input.dto';

@InputType()
export class CreateDealPromoCodeInputDto extends CreateDealInputDto {
  @IsString()
  @Field(() => String)
  promoCode: string;

  @IsNumber()
  @Field(() => Int)
  quantity: number;
}
