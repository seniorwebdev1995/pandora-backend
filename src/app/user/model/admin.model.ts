import { ObjectType } from '@nestjs/graphql';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { defaultRootDocSchemaOption } from '../../helpers/default-schema-option.tools';
import { CommonUser } from './common-user.model';

export type AdminId = string;

@ObjectType()
@Schema(defaultRootDocSchemaOption)
export class Admin extends CommonUser {}

export const AdminSchema = SchemaFactory.createForClass(Admin);
