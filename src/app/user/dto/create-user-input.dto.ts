import { ArgsType, InputType } from '@nestjs/graphql';
import { CommonCreateUserInputDto } from './common-create-user-input.dto';

@ArgsType()
@InputType()
export class CreateUserInputDto extends CommonCreateUserInputDto {}
