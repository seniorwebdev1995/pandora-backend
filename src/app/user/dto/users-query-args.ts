import { ArgsType, Field, InputType, registerEnumType } from '@nestjs/graphql';
import { createPaginationArgs } from '../../pagination/pagination-args.graphql';
import { UserId } from '../model/user.model';

export enum UserSortFields {
  email = 'email',
  createdAt = 'createdAt',
}

registerEnumType(UserSortFields, { name: 'userSortFields' });

@InputType()
export class UsersQueryFilterInput {
  @Field(() => [String], { nullable: true })
  ids?: UserId[];

  @Field({ nullable: true })
  email?: string;
}

@ArgsType()
export class UsersQueryArgs extends createPaginationArgs(UserSortFields) {
  @Field({ nullable: true })
  filter?: UsersQueryFilterInput;
}
