import { ArgsType, Field, InputType, registerEnumType } from '@nestjs/graphql';
import { ListArgsFactory } from '../../pagination/models/list-args-factory.function';
import { ListUserFilterInputDto } from './list-user-filter-input.dto';

export enum ListUserInputSortFields {
  email = 'email',
  createdAt = 'createdAt',
}

registerEnumType(ListUserInputSortFields, {
  name: 'eListUserInputSortFields',
});

@ArgsType()
@InputType()
export class ListUserInput extends ListArgsFactory(() => ListUserInputSortFields, 'Users') {
  @Field(() => ListUserFilterInputDto, { nullable: true })
  criteria: ListUserFilterInputDto;
}
