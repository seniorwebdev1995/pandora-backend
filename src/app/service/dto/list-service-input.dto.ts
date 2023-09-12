import { ArgsType, Field, InputType, registerEnumType } from '@nestjs/graphql';
import { ListArgsFactory } from '../../pagination/models/list-args-factory.function';
import { ListServiceFilterInputDto } from './list-service-filter-inout.dto';

enum ListServiceInputSortFields {
  name = 'name',
  createdAt = 'createdAt',
}

registerEnumType(ListServiceInputSortFields, {
  name: 'ListServiceInputSortFields',
});

@ArgsType()
@InputType()
export class ListServiceInput extends ListArgsFactory(() => ListServiceInputSortFields, 'Service') {
  @Field(() => ListServiceFilterInputDto, { nullable: true })
  criteria: ListServiceFilterInputDto;
}
