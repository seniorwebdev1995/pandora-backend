import { postExecRule, PostExecutionRule } from '@graphql-authz/core';
import { IRuleConfig } from '@graphql-authz/core/dist/rules';
import { intersection, isNil, some } from 'lodash';
import { AuthTokenPayload, Role } from '../../types';
import { AuthZContext } from '../authz-rules';
import { getJwtPayloadFromAuthzContext, NestedUnauthorizedError } from '../helpers';

// Tell whether the fields can be accessed.
export type AuthzPredicate<F extends string = string> = (
  jwtPayload: AuthTokenPayload,
  doc: {
    [key in F | '_id']?: unknown;
  },
) => boolean | void;

// Protect a set of fields with a predicate.
export const protectDocFieldsWithPostExecAuthz = <F extends string>(
  protectedFields: F[],
  predicate: AuthzPredicate<F>,
  options?: { selectionSet?: string },
): new (config: IRuleConfig) => PostExecutionRule =>
  postExecRule({
    selectionSet: options?.selectionSet || '{ _id }',
  })(
    (
      context: AuthZContext,
      fieldArgs: unknown,
      doc: {
        [key in F | '_id']?: unknown;
      },
    ) => {
      if (!doc) {
        // This happen when the doc was not found. Therefore there are no fields here to protect.
        return true;
      }
      if (isNil(doc._id)) {
        throw Error(
          'Doc has no _id. It is possibly a bug. This rule must be placed on an ObjectType and have a selectionSet that contains _id',
        );
      }
      let foundProtectedField: string | undefined = undefined;
      const hasProtectedFields = some(protectedFields, (field) => {
        if (!isNil(doc[field])) {
          foundProtectedField = field;
          return true;
        }
        return false;
      });
      if (!hasProtectedFields) {
        return true;
      }
      const jwtPayload = getJwtPayloadFromAuthzContext(context);
      const predicateResult = predicate(jwtPayload, doc);
      if (predicateResult === true || isNil(predicateResult)) {
        return true;
      }
      throw new NestedUnauthorizedError(
        `Missing permission to read some fields: ${foundProtectedField}`,
      );
    },
  );

export const mustMatchRolePredicate =
  (...authorizedRoles: Role[]): AuthzPredicate =>
  (jwtPayload: AuthTokenPayload) =>
    authorizedRoles.includes(jwtPayload.role);

export type PerFieldAuthzPredicateMap<F extends string> = Partial<Record<F, AuthzPredicate<F>>>;

export const perFieldPredicate = <F extends string>(
  perFieldPredicateMap: PerFieldAuthzPredicateMap<F>,
): AuthzPredicate => {
  const fieldList = Object.keys(perFieldPredicateMap);
  return (jwtPayload: AuthTokenPayload, doc: object) => {
    const presentProtectedFields = intersection(Object.keys(doc), fieldList);
    const unauthorizedFields = new Set();
    for (const field of presentProtectedFields) {
      const predicate = perFieldPredicateMap[field];
      const isAuthorized = predicate(jwtPayload, doc);
      if (!isAuthorized) {
        unauthorizedFields.add(field);
      }
    }
    if (unauthorizedFields.size > 0) {
      throw new NestedUnauthorizedError(
        `Missing permission to read field ${Array.from(unauthorizedFields).join(', ')}`,
      );
    }
  };
};
