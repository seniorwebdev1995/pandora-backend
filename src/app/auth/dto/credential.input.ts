import { ArgsType, Field } from '@nestjs/graphql';
import { IsDefined, IsEmail } from 'class-validator';

@ArgsType()
export class CredentialInput {
  @Field()
  @IsEmail()
  @IsDefined()
  email: string;

  @Field()
  @IsDefined()
  password: string;

  toString(): string {
    return `email: ${this.email}, password: ${this.password}`;
  }
}
