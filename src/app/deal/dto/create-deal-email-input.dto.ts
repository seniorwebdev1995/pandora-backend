import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { CreateDealInputDto } from './create-deal-input.dto';

@InputType()
export class CreateDealEmailInputDto extends CreateDealInputDto {
  @IsEmail()
  @Field(() => String)
  contactEmail: string;
}
