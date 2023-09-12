import { isEqual } from 'lodash';

const defaultMessage = 'Expected to obtain equal values';

// Assert deep equality
export const assertDeepEqual = (a: unknown, b: unknown, message: string = defaultMessage): void => {
  if (!isEqual(a, b)) {
    throw new Error(
      `${message}.\n${JSON.stringify(a, null, 2)}\nvs\n${JSON.stringify(b, null, 2)}`,
    );
  }
};
