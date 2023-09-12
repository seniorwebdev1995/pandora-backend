import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import { defaultSubDocSchemaOption } from '../helpers/default-schema-option.tools';

@InputType('ServiceOfferItemInput')
@ObjectType()
@Schema(defaultSubDocSchemaOption)
export class ServiceOfferItem {
  @Prop({ required: true })
  @Field(() => String)
  title: string;

  @Prop({ required: true })
  @Field(() => String)
  desc: string;
}

@InputType('ServiceOfferInput')
@ObjectType()
@Schema(defaultSubDocSchemaOption)
export class ServiceOffer {
  @Prop({ required: true })
  @Field(() => String)
  title: string;

  @Prop({ required: true })
  @Field(() => String)
  desc: string;

  @Prop({ type: ServiceOfferItem, default: [] })
  @Field(() => [ServiceOfferItem])
  serviceOffers: ServiceOfferItem[];
}

@InputType()
export class ServiceOfferInput extends ServiceOffer {}
