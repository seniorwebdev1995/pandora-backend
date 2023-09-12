import { Field, Float, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CategoryId } from '../category/category.model';
import { defaultRootDocSchemaOption } from '../helpers/default-schema-option.tools';
import { DefaultModel } from '../helpers/default.model';
import { DealType, IDealType, registerDealTypeSchemas } from './deal-type';

export type DealId = string;

@ObjectType()
@Schema(defaultRootDocSchemaOption)
export class Deal extends DefaultModel {
  // $5,000 in AWS credits for 2 years
  @Prop({ required: true })
  @Field(() => String)
  name: string;

  // AWS Activate
  @Prop({ required: true })
  @Field(() => String)
  companyName: string;

  // Amazon's cloud services platform
  @Prop({ required: true })
  @Field(() => String)
  companyDesc: string;

  // Efficiently develop, deploy and maintain high-performance and scalable applications.
  @Prop({ required: true })
  @Field(() => String)
  smallDesc: string;

  @Prop({ required: true, default: [], index: true })
  @Field(() => [String])
  categoriesIds: CategoryId[];

  // first time sub etc...
  @Prop({ required: true, default: [] })
  @Field(() => [String])
  requirements: string[];

  // $5000 savings
  @Prop({ required: true })
  @Field(() => Float)
  amountSaved: number;

  @Prop({ default: 0 })
  @Field(() => Int)
  redeemedAmount: number;

  @Prop({ required: true })
  @Field(() => String)
  companyLogoURL: string;

  @Prop({ required: true })
  @Field(() => String)
  externalLink: string;

  // ex : Interested in AWS Activate? Get $5,000 in AWS credits for 2 years on AWS Activate with our promo code and save up to $5000.
  @Prop({ required: true })
  @Field(() => String)
  promoText: string;

  @Prop({ required: true })
  @Field(() => String)
  descriptionInHTML: string;

  @Prop({ required: true })
  @Field(() => String)
  videoUrl: string;

  @Prop({ type: IDealType, required: true })
  @Field(() => IDealType)
  type: DealType;
}

@InputType()
export class DealInput extends Deal {}

export const DealSchema = SchemaFactory.createForClass(Deal);
registerDealTypeSchemas(DealSchema.path('type') as any);
