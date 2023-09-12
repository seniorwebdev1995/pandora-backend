import { or, postExecRule } from '@graphql-authz/core';
import { z } from 'zod';
import { AuthZContext } from '../auth/authz/authz-rules';
import { getOptionalJwtPayloadFromAuthzContext } from '../auth/authz/helpers';
import { canReadAuthorizedDocuments } from '../auth/authz/rule-builders/can-read-authorized-documents';
import {
  mustMatchRolePredicate,
  protectDocFieldsWithPostExecAuthz,
} from '../auth/authz/rule-builders/protect-doc-fields-with-post-exec-authz';
import { Role } from '../auth/types';
import { User } from '../user/model/user.model';
import type { CommonUser } from './model/common-user.model';
import type { UserResolver } from './user.resolver';

const adminProtectedFields: (keyof UserResolver | keyof CommonUser)[] = [
  'email', // Field
  'deleted', // Field
];

const AdminCanReadAllUserFields = protectDocFieldsWithPostExecAuthz(
  adminProtectedFields,
  mustMatchRolePredicate(Role.Admin),
);

const UserCanReadHisOwnFields = postExecRule({
  selectionSet: '{ _id }',
  error: 'Not enough permissions to read these user data',
})((context: AuthZContext, fieldArgs: unknown, user: User) => {
  if (!user) {
    return true;
  }
  z.string().parse(user?._id);
  const jwtPayload = getOptionalJwtPayloadFromAuthzContext(context);
  return jwtPayload?.sub === user._id;
});

const CommonUserDocProtectedFields = or(
  AdminCanReadAllUserFields,
  UserCanReadHisOwnFields,
  canReadAuthorizedDocuments,
);

export const userAuthZRules = {
  CommonUserDocProtectedFields,
} as const;
