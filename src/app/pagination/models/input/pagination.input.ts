import { Field, InputType, Int } from '@nestjs/graphql';
import { IsOptional, Max, Min } from 'class-validator';

export interface iPaginationOption {
  before?: number;
  after?: number;
  cursor?: string;
}

@InputType({ isAbstract: true })
export class PaginationOption {
  @Field(() => String, { nullable: true })
  @IsOptional()
  cursor?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(0)
  before?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(0)
  @Max(20)
  after?: number;
}
