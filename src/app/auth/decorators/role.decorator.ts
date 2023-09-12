import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../guards/role.guard';
import { ENDPOINT_AUTHORIZED_ROLES_METADATA_KEY } from '../metadata';
import { Role } from '../types';

export const Roles = (...roles: Role[]): MethodDecorator => {
  return applyDecorators(
    SetMetadata(ENDPOINT_AUTHORIZED_ROLES_METADATA_KEY, roles),
    UseGuards(RolesGuard),
  );
};
