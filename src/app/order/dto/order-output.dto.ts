import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrderOutputDto {
  @Field({ nullable: true })
  promoCode?: string;
}
