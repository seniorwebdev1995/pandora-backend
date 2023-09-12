import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../model/user.model';

export const userOutputDtoKeys: (keyof User)[] = ['_id', 'email'];

@InputType({ isAbstract: true })
@ObjectType()
export class UserOutputDto extends PickType(User, userOutputDtoKeys) {}
