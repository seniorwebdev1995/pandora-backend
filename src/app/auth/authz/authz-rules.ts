import { Request } from 'express';
import { adminActionAuthZRules } from '../../helpers/admin-action/authz-rules';
import { userAuthZRules } from '../../user/authz-rules';

export interface AuthZContext {
  req: Request;
}

export const authZRules = {
  ...userAuthZRules,
  ...adminActionAuthZRules,
} as const;
