import { Field, InterfaceType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { z } from 'zod';
import { defaultSubDocWithDiscriminatorSchemaOption } from '../helpers/default-schema-option.tools';

export enum ListDealType {
  Wallet = 'Wallet',
  PromoCode = 'PromoCode',
  IntroEmail = 'IntroEmail',
}

registerEnumType(ListDealType, {
  name: 'ListDealType',
});

const resolveType = (value: DealType) => {
  switch (value.kind) {
    case ListDealType.Wallet:
      return WalletType;
    case ListDealType.PromoCode:
      return PromocodeType;
    case ListDealType.IntroEmail:
      return IntroEmailType;
    default:
      throw Error(`Unknown DealType kind ${(value as any).kind}`);
  }
};

@InterfaceType({ resolveType })
@Schema({ ...defaultSubDocWithDiscriminatorSchemaOption, discriminatorKey: 'kind' })
export class IDealType {
  @Field(() => ListDealType)
  kind: ListDealType;
}

@ObjectType({ implements: IDealType })
@Schema(defaultSubDocWithDiscriminatorSchemaOption)
export class WalletType extends IDealType {
  kind = ListDealType.Wallet as const;

  @Prop({ required: true })
  @Field(() => [String])
  collectionWallet: string[];

  @Prop({ required: true })
  @Field()
  promoCode: string;
}

@ObjectType({ implements: IDealType })
@Schema(defaultSubDocWithDiscriminatorSchemaOption)
export class PromocodeType extends IDealType {
  kind = ListDealType.PromoCode as const;

  @Prop({ required: true })
  @Field()
  promoCode: string;

  @Prop({ required: true })
  @Field()
  quantity: number;
}

@ObjectType({ implements: IDealType })
@Schema(defaultSubDocWithDiscriminatorSchemaOption)
export class IntroEmailType extends IDealType {
  kind = ListDealType.IntroEmail as const;

  @Prop({ required: true })
  @Field()
  contactEmail: string;
}

export const WalletTypeSchema = SchemaFactory.createForClass(WalletType);
export const PromocodeTypeSchema = SchemaFactory.createForClass(PromocodeType);
export const IntroEmailTypeSchema = SchemaFactory.createForClass(IntroEmailType);

export const registerDealTypeSchemas = (schema: MongooseSchema): void => {
  z.object({}).parse(schema);
  schema.discriminator(ListDealType.IntroEmail, IntroEmailTypeSchema);
  schema.discriminator(ListDealType.PromoCode, PromocodeTypeSchema);
  schema.discriminator(ListDealType.Wallet, WalletTypeSchema);
};

export type DealType = WalletType | PromocodeType | IntroEmailType;
