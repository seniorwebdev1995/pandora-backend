import { IAuthConfig } from '@graphql-authz/core';
import { Directive } from '@nestjs/graphql';
import { authZRules } from './authz-rules';

// AuthZ decorator that wraps Directive decorator
export function AuthZ(
  config: IAuthConfig<typeof authZRules>,
): MethodDecorator & PropertyDecorator & ClassDecorator {
  const args = (Object.keys(config) as Array<keyof typeof config>)
    .map((key) => `${String(key)}: ${JSON.stringify(config[key]).replace(/"/g, '')}`)
    .join(', ');
  const directiveArgs = `(${args})`;
  return Directive(`@authz${directiveArgs}`);
}
