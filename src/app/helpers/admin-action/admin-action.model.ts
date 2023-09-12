import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import { AdminId } from '../../user/model/admin.model';
import { defaultSubDocSchemaOption } from '../default-schema-option.tools';

@ObjectType()
@Schema(defaultSubDocSchemaOption)
export class AdminAction {
  @Prop({ required: true })
  @Field()
  date: Date;

  @Prop({ required: true })
  @Field()
  adminId: AdminId;
}
