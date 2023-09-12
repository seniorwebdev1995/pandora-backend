/* eslint-disable @typescript-eslint/ban-types */
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppLogger } from '../logging/logging.service';
import {
  ENDPOINT_AUTHORIZED_ROLES_METADATA_KEY,
  ENDPOINT_IS_PUBLIC_METADATA_KEY,
} from './metadata';
import { Role } from './types';

// Provide easy access to endpoint's auth metadata

@Injectable()
export class EndpointAuthMetadataManager {
  constructor(private logger: AppLogger, private reflector: Reflector) {
    this.logger.setContext(EndpointAuthMetadataManager.name);
  }

  isPublicEndpoint(endpointHandler: Function): boolean {
    const isPublic = this.getMetadataFromContextHandler<boolean>(
      ENDPOINT_IS_PUBLIC_METADATA_KEY,
      endpointHandler,
    );
    return isPublic ?? false;
  }

  isRoleProtectedEndpoint(endpointHandler: Function): boolean {
    const roles = this.getEndpointAuthorizedRoles(endpointHandler);
    return Boolean(roles);
  }

  getEndpointAuthorizedRoles(endpointHandler: Function): Role[] | undefined {
    const roles = this.getMetadataFromContextHandler<Role[]>(
      ENDPOINT_AUTHORIZED_ROLES_METADATA_KEY,
      endpointHandler,
    );
    return roles;
  }

  private getMetadataFromContextHandler<T>(key: string, handler: Function): T | undefined {
    return this.reflector.get<T>(key, handler);
  }
}
