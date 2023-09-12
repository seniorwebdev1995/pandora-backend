import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Token {
  @Field()
  token: string;

  @Field()
  expiresAt: Date;
}

@ObjectType()
export class TokenPairOutputDto {
  @Field(() => Token)
  authToken: Token;

  @Field(() => Token)
  refreshToken: Token;
}
