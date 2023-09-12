import { SchemaOptions } from 'mongoose';

export const defaultDocSchemaOption: SchemaOptions = {
  id: false, // Do not create an extra id field. _id is plenty.
  versionKey: false,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  strictQuery: 'throw', // Do not silently remove unknown filters in our back, because this can lead to unexpected results while refactoring things.
};

export const defaultRootDocSchemaOption: SchemaOptions = {
  ...defaultDocSchemaOption,
  _id: true,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
};

export const defaultSubDocSchemaOption: SchemaOptions = {
  ...defaultDocSchemaOption,
  _id: false,
};

export const defaultSubDocWithDiscriminatorSchemaOption: SchemaOptions = {
  ...defaultSubDocSchemaOption,
  strictQuery: false, // Workaround for mongoose bug https://github.com/nestjs/mongoose/issues/1516
};
