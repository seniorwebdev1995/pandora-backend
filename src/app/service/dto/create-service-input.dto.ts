import { InputType, PickType } from '@nestjs/graphql';
import { ServiceInput } from '../service.model';

@InputType()
export class CreateServiceInputDto extends PickType(ServiceInput, [
  'name',
  'companyName',
  'companyDesc',
  'smallDesc',
  'categorieIds',
  'requirements',
  'amountSaved',
  'redeemedAmount',
  'companyLogoURL',
  'externalLink',
  'promoText',
  'descriptionInHTML',
  'offers',
]) {}
