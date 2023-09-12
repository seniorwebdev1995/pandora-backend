import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { UserId } from '../../user/model/user.model';

// May or may not return a userId
const optionalCurrentUserIdFactory = (
  data: unknown,
  context: ExecutionContext,
): UserId | undefined => {
  const ctx = GqlExecutionContext.create(context);
  return ctx.getContext<{ req: Request }>().req.jwtPayload?.sub;
};

// Guarantee a userId
const currentUserIdFactory = (data: unknown, context: ExecutionContext): UserId => {
  const userId = optionalCurrentUserIdFactory(data, context);
  if (!userId) {
    throw Error('User id not found in context');
  }
  return userId;
};

export const OptionalCurrentUserId = createParamDecorator(optionalCurrentUserIdFactory);
export const CurrentUserId = createParamDecorator(currentUserIdFactory);
