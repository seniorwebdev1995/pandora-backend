import { GraphQLError, GraphQLFormattedError } from 'graphql';
import {
  isSerializedAuthzUnauthorizedMessage,
  unserializeUnauthorizedMessage,
} from '../auth/authz/helpers';
import { Env } from '../config/base.config';
import { BadInputError } from './errors/BadInputError';

export const prettyErrorsHelper = (env: Env) => {
  return (error: GraphQLError): GraphQLFormattedError => {
    const { originalError } = error;
    if (originalError instanceof BadInputError) {
      // This is an unhandled BadInputError thrown from a service.
      // We do not want to have it appear as `INTERNAL_SERVER_ERROR`.
      error.extensions.code = 'BAD_USER_INPUT';
    }

    if (isSerializedAuthzUnauthorizedMessage(error.message)) {
      // AuthZ errors always have a FORBIDDEN code.
      // However if the error was thrown because of a missing token, we prefer sending UNAUTHORIZED instead.
      // There seems to be no way to customize the error class in AuthZ.
      // Therefore we use a little trick in the error message to notify that this should be an UnauthorizedError and not a ForbiddenError.
      // These serialized error messages are created in the Authz rule with the serializeUnauthorizedMessage helper.
      error.message = unserializeUnauthorizedMessage(error.message);
      error.extensions.code = 'UNAUTHORIZED';
    }
    return {
      path: error.path,
      locations: error.locations,
      message: [Env.development, Env.staging].includes(env) ? error.message : error.name,
      extensions: [Env.development].includes(env)
        ? error.extensions
        : { code: error.extensions.code },
    };
  };
};
