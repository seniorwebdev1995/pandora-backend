export const extractBearerToken = (str: string): string => {
  const match = str.match(/^Bearer (.+)$/);
  if (!match) {
    throw new InvalidBearerToken();
  }
  return match[1];
};

export class InvalidBearerToken extends Error {
  constructor() {
    super('Invalid bearer token');
  }
}
