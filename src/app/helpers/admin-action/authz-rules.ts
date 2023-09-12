import { protectDocFieldsWithPostExecAuthz } from '../../auth/authz/rule-builders/protect-doc-fields-with-post-exec-authz';
import { AuthTokenPayload, Role } from '../../auth/types';
import { AdminAction } from './admin-action.model';
import { AdminActionResolver } from './admin-action.resolver';

type AdminActionResolverFields = keyof AdminAction | keyof AdminActionResolver;

const kpiFields: AdminActionResolverFields[] = [
  'adminId', // Field
  'admin', // ResolveField
];

// Protect the KPI fields. Only admins and the original artist can read it.
const adminActionDocProtectedFields = protectDocFieldsWithPostExecAuthz<AdminActionResolverFields>(
  kpiFields,
  ({ role }: AuthTokenPayload) => role === Role.Admin,
);

export const adminActionAuthZRules = {
  adminActionDocProtectedFields,
} as const;
