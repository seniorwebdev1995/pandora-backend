import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthenticationError } from 'apollo-server-express';
import { Request } from 'express';
import { z } from 'zod';
import { extractBearerToken } from '../helpers/extract-bearer-token';

export const CurrentAuthToken = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context);
  try {
    const authorizationHeader = z
      .string()
      .optional()
      .safeParse(ctx.getContext<{ req: Request }>().req.headers.authorization);
    if (!authorizationHeader.success) {
      throw new AuthenticationError('Invalid authorization header');
    }
    if (authorizationHeader.data) {
      const authorizationToken = extractBearerToken(authorizationHeader.data);
      return authorizationToken;
    }
  } catch (error) {
    throw new AuthenticationError(error.message);
  }
});

export const CurrentAuthTokenPayload = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const jwtPayload = ctx.getContext<{ req: Request }>().req.jwtPayload;
    if (!jwtPayload) {
      throw new AuthenticationError('No user authenticated');
    }
    return jwtPayload;
  },
);
