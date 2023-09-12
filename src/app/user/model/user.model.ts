import { ArgsType, Field, InputType, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AuthZ } from '../../auth/authz/authz.decorator';
import { defaultRootDocSchemaOption } from '../../helpers/default-schema-option.tools';
import { CommonUser } from './common-user.model';

export type UserId = string;

@ObjectType()
@Schema(defaultRootDocSchemaOption)
@AuthZ({ rules: ['CommonUserDocProtectedFields'] })
export class User extends CommonUser {
  @Prop({ unique: true })
  @Field(() => String)
  referralCode: string;
}

@ArgsType()
@InputType()
export class CommonUserInput extends User {}

export const UserSchema = SchemaFactory.createForClass(User);
