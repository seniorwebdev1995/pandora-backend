import { memoize } from 'lodash';
import moment from 'moment';
import { customAlphabet } from 'nanoid';

export function getSerializedTimestamp(date = new Date()): string {
  return moment(date).format('YYYY-MM-DD-hh-mm-ss');
}

const getShortIdGenerator = memoize((size: number) =>
  customAlphabet('123456789abcdefghijklmnopqrstuvwxyz', size),
);

export const createAlphanumericId = (size = 8): string => getShortIdGenerator(size)();
