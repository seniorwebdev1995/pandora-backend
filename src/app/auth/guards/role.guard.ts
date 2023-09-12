import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import { Request } from 'express';
import { z } from 'zod';
import { AppLogger } from '../../logging/logging.service';
import { EndpointAuthMetadataManager } from '../endpoint-auth-metadata-manager.service';
import { Role } from '../types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly logger: AppLogger,
    private readonly endpointAuthMetadataManager: EndpointAuthMetadataManager,
  ) {
    this.logger.setContext(RolesGuard.name);
  }

  canActivate(context: ExecutionContext): boolean {
    const endpointHandler = context.getHandler();
    this.logger.verbose(`canActivate ${endpointHandler.name}`);

    const requiredRoles =
      this.endpointAuthMetadataManager.getEndpointAuthorizedRoles(endpointHandler);
    if (!requiredRoles) {
      throw new InternalServerErrorException(
        `Could not find roles in endpoint ${endpointHandler.name}'s metadata. This is a bug.`,
      );
    }
    const ctx = GqlExecutionContext.create(context);
    const req: Request = new ExecutionContextHost([ctx.getContext().req])
      .switchToHttp()
      .getRequest();
    const { jwtPayload, jwtPayloadError } = req;
    if (jwtPayloadError) {
      throw new AuthenticationError(jwtPayloadError.message);
    }
    if (!jwtPayload) {
      throw new AuthenticationError('No user authenticated');
    }
    const userRole = z.string().safeParse(jwtPayload.role);
    if (!userRole.success) {
      throw new AuthenticationError('User role must be a string');
    }
    const isUserRoleAuthorized = requiredRoles.includes(userRole.data as Role);
    if (!isUserRoleAuthorized) {
      throw new ForbiddenError(`This endpoint is not accessible with your role (${userRole.data})`);
    }
    return true;
  }
}
