import { UnauthorizedError } from '@graphql-authz/core';
import { uniq } from 'lodash';
import { AuthTokenPayload } from '../types';
import { AuthZContext } from './authz-rules';

// Safely get the JWT payload from context.
// Will throw UnauthorizedError if the token is not found.

// AuthZ can only throw FORBIDDEN errors.
// However if the error was thrown because of a missing token, we prefer sending UNAUTHORIZED instead.
// There seems to be no way to customize the error class in AuthZ.
// Therefore we use a little trick in the error message to notify that this should be an UnauthorizedError and not a ForbiddenError.
// These serialized message errors are detected and handled later by the prettyErrorsHelper.

export const getOptionalJwtPayloadFromAuthzContext = (
  context: AuthZContext,
): AuthTokenPayload | undefined => {
  const { jwtPayload, jwtPayloadError } = context.req;
  if (jwtPayloadError) {
    throw new NestedUnauthorizedError(jwtPayloadError.message);
  }
  return jwtPayload;
};

export const getJwtPayloadFromAuthzContext = (context: AuthZContext): AuthTokenPayload => {
  const { jwtPayload, jwtPayloadError } = context.req;
  if (!jwtPayload) {
    throw new NestedUnauthorizedError(jwtPayloadError?.message || 'Missing JWT');
  }
  return jwtPayload;
};

export class NestedUnauthorizedError extends UnauthorizedError {
  constructor(message: string) {
    super(serializeUnauthorizedMessage(message));
  }
}
const PREFIX = '__serializedUnauthorizedMessage__';
const serializeUnauthorizedMessage = (message: string) => `${PREFIX}${message}`;
export const isSerializedAuthzUnauthorizedMessage = (message: string): boolean =>
  message.startsWith(PREFIX);
export const unserializeUnauthorizedMessage = (message: string): string => {
  // Authz sends multiline error message, with one message per line.
  // If the same forbidden field provokes the same error multiple times, we
  // only need to see it once.
  const lines = message.split('\n');
  return uniq(lines)
    .map((l) => l.replace(PREFIX, ''))
    .join('\n');
};
