import { transform } from 'lodash';
import { z, ZodError } from 'zod';

type EnvField = readonly [string, Zod.ZodType];
type EnvFieldMap = Record<string, EnvField>;

export type InferConfig<M extends EnvFieldMap> = {
  [key in keyof M]: z.TypeOf<M[key][1]>;
};

export const createConfigFromEnv = <FM extends EnvFieldMap>(
  fields: FM,
  env: NodeJS.ProcessEnv,
): InferConfig<FM> => {
  const [errors, config] = transform(
    fields,
    ([errors, obj], [envField, schema], configField: string & keyof InferConfig<FM>) => {
      try {
        obj[configField] = schema.parse(env[envField]);
      } catch (error) {
        if (error instanceof ZodError) {
          errors.push(new EnvFieldValidationError(envField, error));
        } else {
          throw error;
        }
      }
    },
    [[] as EnvFieldValidationError[], {} as InferConfig<FM>],
  );
  if (errors.length > 0) {
    throw new EnvValidationError(
      `Invalid environment variable(s):\n` +
        errors
          .map(
            (error) =>
              `\t${error.envField}: ${error.zodError.errors
                .map((error) => error.message)
                .join('\n')}`,
          )
          .join(`\n`),
    );
  }
  return config;
};

class EnvFieldValidationError extends Error {
  constructor(readonly envField: string, readonly zodError: ZodError) {
    super();
  }
}

class EnvValidationError extends Error {}
