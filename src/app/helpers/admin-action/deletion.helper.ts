import { Condition } from 'mongoose';

export type SoftDeleteOptions = { excludeSoftDeleted?: boolean };

export const excludeIfSoftDeleted = <T>({
  excludeSoftDeleted,
}: SoftDeleteOptions): Condition<T> => {
  if (excludeSoftDeleted) {
    return { deleted: null };
  }
  return {};
};
