import { Field, Float, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CategoryId } from '../category/category.model';
import { AdminAction } from '../helpers/admin-action/admin-action.model';
import { defaultRootDocSchemaOption } from '../helpers/default-schema-option.tools';
import { DefaultModel } from '../helpers/default.model';
import { ServiceOffer } from './service-offer.model';

export type ServiceId = string;

@ObjectType()
@Schema(defaultRootDocSchemaOption)
export class Service extends DefaultModel {
  @Prop({ required: true, unique: true })
  @Field(() => String)
  name: string;

  @Prop({ required: true })
  @Field(() => String)
  companyName: string;

  @Prop({ required: true })
  @Field(() => String)
  companyDesc: string;

  @Prop({ required: true })
  @Field(() => String)
  smallDesc: string;

  @Prop({ required: true, default: [], index: true })
  @Field(() => [String])
  categorieIds: CategoryId[];

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
  @Field()
  offers: ServiceOffer;

  @Prop({ type: AdminAction })
  @Field(() => AdminAction, { nullable: true })
  deleted?: AdminAction;
}

@InputType()
export class ServiceInput extends Service {}

export const ServiceSchema = SchemaFactory.createForClass(Service);
