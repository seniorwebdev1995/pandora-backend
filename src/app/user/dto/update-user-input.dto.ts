import { Field, InputType, PartialType, PickType } from '@nestjs/graphql';
import { CommonUserInput } from '../model/user.model';

export const commonUpdateUserInputDtoKeys: (keyof CommonUserInput)[] = ['email'];

@InputType()
export class UpdateUserInputDto extends PartialType(
  PickType(CommonUserInput, commonUpdateUserInputDtoKeys),
) {
  @Field({ nullable: true })
  newPassword?: string;

  @Field({ nullable: true })
  currentPassword?: string;
}
