import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AppLogger } from '../../logging/logging.service';
import { EndpointAuthMetadataManager } from '../endpoint-auth-metadata-manager.service';

// Make sure the endpoint is protected by at least one auth policy.
// It prevents leaving an open endpoint by accident.

@Injectable()
export class EndpointAuthMonitorGuard implements CanActivate {
  constructor(
    private readonly logger: AppLogger,
    private readonly endpointAuthMetadataManager: EndpointAuthMetadataManager,
  ) {
    this.logger.setContext(EndpointAuthMonitorGuard.name);
  }

  canActivate(context: ExecutionContext): boolean {
    const endpointHandler = context.getHandler();
    const isPublic = this.endpointAuthMetadataManager.isPublicEndpoint(endpointHandler);
    if (isPublic) {
      return true; // This endpoint is declared public. That's ok.
    }
    const isRoleProtected =
      this.endpointAuthMetadataManager.isRoleProtectedEndpoint(endpointHandler);
    if (isRoleProtected) {
      return true; // This endpoint is role-proected. That's ok.
    }
    throw new InternalServerErrorException(
      `Endpoint ${
        context.getHandler().name
      }(...) is not protected by any authorization policy. This is probably an oversight.`,
    );
  }
}
