import { postExecRule } from '@graphql-authz/core';
import { z } from 'zod';
import { AuthZContext } from '../authz-rules';

// Provide a per-doc-id conditional acceptation AuthZ rule.
const contextKey = `__AllowedDesignatedDocIds`;

export const setAsAuthorizedDocument = (docId: string, context: object): void => {
  if (!context[contextKey]) {
    context[contextKey] = [];
  }
  context[contextKey].push(docId);
};

export const canReadAuthorizedDocuments = postExecRule({
  selectionSet: '{ _id }',
  error: 'Not enough permissions to read these user data',
})((context: AuthZContext, fieldArgs: unknown, doc: { _id?: string }) => {
  if (!doc) {
    return true;
  }
  const docId = z.string().parse(doc?._id);
  const allowedIds = z.array(z.string()).parse(context[contextKey] || []);
  return allowedIds.includes(docId);
});
