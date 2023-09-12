import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserId } from 'aws-sdk/clients/appstream';
import { DealType, IDealType } from '../deal/deal-type';
import { DealId } from '../deal/deal.model';
import { defaultRootDocSchemaOption } from '../helpers/default-schema-option.tools';
import { DefaultModel } from '../helpers/default.model';

export type OrderId = string;

@ObjectType()
@Schema(defaultRootDocSchemaOption)
export class Order extends DefaultModel {
  @Prop({ required: true })
  @Field(() => String)
  buyerId: UserId;

  @Prop({ required: true })
  @Field(() => String)
  dealId: DealId;

  @Prop()
  @Field({ nullable: true })
  collectionFound?: string;

  @Prop({ type: IDealType, required: true })
  @Field(() => IDealType)
  type: DealType;
}

@InputType()
export class OrderInput extends Order {}

export const OrderSchema = SchemaFactory.createForClass(Order);
