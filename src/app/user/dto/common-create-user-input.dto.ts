import { ArgsType, Field, InputType, PickType } from '@nestjs/graphql';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { CommonUserInput } from '../model/user.model';

const commonCreateUserInputDtoKeys: (keyof CommonUserInput)[] = ['email'];

@ArgsType()
@InputType()
export class CommonCreateUserInputDto extends PickType(
  CommonUserInput,
  commonCreateUserInputDtoKeys,
) {
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  @Field(() => String, { nullable: false })
  // https://stackoverflow.com/a/72686232/1541141 (modified to make symbols optional)
  @Matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.* ).{5,20}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter and one number. Password length must be between 5 and 20 characters.',
  })
  password: string;
}
