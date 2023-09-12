/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { z } from 'zod';

const stringToBool = (val: string | undefined): boolean | undefined =>
  val !== undefined && val !== '' ? ['1', 'true'].includes(val.toLowerCase()) : undefined;

export const stringifiedBooleanZod = (defaultVal: boolean) => {
  return z.preprocess(stringToBool, z.boolean().default(defaultVal));
};

export const stringifiedOptionalBooleanZod = () => {
  return z.preprocess(stringToBool, z.boolean().optional());
};

const stringToInteger = (str: string | undefined): number | undefined =>
  str !== undefined ? parseInt(str) : undefined;

// TODO is it necessary to have separate function ? cant i chain default()?
export const stringifiedIntegerZod = (defaultVal: number) => {
  return z.preprocess(stringToInteger, z.number().default(defaultVal));
};

export const stringifiedOptionalIntegerZod = () => {
  return z.preprocess(stringToInteger, z.number().optional());
};
