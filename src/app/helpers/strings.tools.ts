import { createHash } from 'crypto';

export const hash = (str: string): string => {
  return createHash('sha256').update(str).digest('hex');
};

// numberToBase64
export function ntb64(input: number): string {
  return Buffer.from(input.toString()).toString('base64');
}

export const b64zero = 'MA==';

// base64ToNumber
export function b64tn(input = b64zero): number {
  return parseInt(Buffer.from(input, 'base64').toString('ascii'), 10);
}
