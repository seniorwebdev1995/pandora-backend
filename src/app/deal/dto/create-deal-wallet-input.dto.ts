import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsString } from 'class-validator';
import { CreateDealInputDto } from './create-deal-input.dto';

@InputType()
export class CreateDealWalletInputDto extends CreateDealInputDto {
  @IsArray()
  @Field(() => [String])
  collectionWallet: string[];

  @IsString()
  @Field(() => String)
  promoCode: string;
}
