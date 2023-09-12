import { InputType, PickType } from '@nestjs/graphql';
import { DealInput } from '../deal.model';

@InputType()
export class CreateDealInputDto extends PickType(DealInput, [
  'name',
  'companyName',
  'companyDesc',
  'smallDesc',
  'categoriesIds',
  'requirements',
  'amountSaved',
  'redeemedAmount',
  'companyLogoURL',
  'externalLink',
  'promoText',
  'descriptionInHTML',
  'videoUrl',
]) {}
