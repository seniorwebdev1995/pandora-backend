import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AdminAction } from '../helpers/admin-action/admin-action.model';
import { defaultRootDocSchemaOption } from '../helpers/default-schema-option.tools';
import { DefaultModel } from '../helpers/default.model';

export type CategoryId = string;

@ObjectType()
@Schema(defaultRootDocSchemaOption)
export class Category extends DefaultModel {
  @Prop({ required: true, unique: true })
  @Field(() => String)
  name: string;

  @Prop({ required: true })
  @Field(() => String)
  imageUrl: string;

  @Prop({ type: AdminAction })
  @Field(() => AdminAction, { nullable: true })
  deleted?: AdminAction;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
