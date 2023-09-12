import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DealId } from '../deal/deal.model';
import { defaultRootDocSchemaOption } from '../helpers/default-schema-option.tools';
import { DefaultModel } from '../helpers/default.model';
import { UserId } from '../user/model/user.model';
import { ListEventsPossible } from './types';

@ObjectType()
@Schema(defaultRootDocSchemaOption)
export class Analytic extends DefaultModel {
  @Prop({ type: String, enum: ListEventsPossible, required: true })
  @Field(() => String)
  key: ListEventsPossible;

  @Prop({ index: true })
  @Field(() => String, { nullable: true })
  userId?: UserId;

  @Prop({ index: true })
  @Field(() => String, { nullable: true })
  dealId?: DealId;

  @Prop()
  @Field(() => String, { nullable: true })
  extra?: string;
}

export const AnalyticSchema = SchemaFactory.createForClass(Analytic);
