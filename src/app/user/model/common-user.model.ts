import { Field, ObjectType } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';
import { AuthZ } from '../../auth/authz/authz.decorator';
import { AdminAction } from '../../helpers/admin-action/admin-action.model';
import { DefaultModel } from '../../helpers/default.model';

@ObjectType({ isAbstract: true })
@AuthZ({ rules: ['CommonUserDocProtectedFields'] })
export class CommonUser extends DefaultModel {
  @Prop({ required: true, unique: true, sparse: true })
  @Field({ nullable: false })
  @IsEmail()
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ select: false })
  refreshJwtHash?: string;

  @Prop({ type: AdminAction })
  @Field(() => AdminAction, { nullable: true })
  deleted?: AdminAction;

  @Prop()
  @Field({ nullable: true })
  lastLoginDate: Date;
}
