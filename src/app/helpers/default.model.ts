import { Field, ObjectType } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';
import { v4 } from 'uuid';

@ObjectType({ isAbstract: true })
export class DefaultModel {
  @Field()
  @Prop({
    default: v4,
  })
  _id: string;

  @Prop({ index: true })
  @Field()
  createdAt: Date;

  @Prop({ index: true })
  @Field()
  updatedAt: Date;
}
