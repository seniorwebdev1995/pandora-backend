import 'dotenv/config';
import { z } from 'zod';
import { stringifiedIntegerZod, stringifiedOptionalBooleanZod } from './helpers/conversions';

export enum Env {
  staging = 'staging',
  development = 'development',
  production = 'production',
}

const PROTOCOLS = ['http', 'https'] as const;
export type Protocol = typeof PROTOCOLS[number];

export const baseConfigZod = {
  nodeEnv: ['NODE_ENV', z.nativeEnum(Env).default(Env.development)],
  port: ['PORT', stringifiedIntegerZod(3000)],
  graphqlPlaygroundEnabled: ['GRAPHQL_PLAYGROUND_ENABLED', stringifiedOptionalBooleanZod()], // FIXME Default
  protocol: ['PROTOCOL', z.enum(PROTOCOLS).default('http')],
  host: ['HOST', z.string().default('localhost')],
  throttleTtl: ['THROTTLE_TTL', stringifiedIntegerZod(10)],
  fileUploadMaxSize: ['FILE_UPLOAD_MAX_SIZE', stringifiedIntegerZod(5 * 1024 * 1024)],
  fileUploadMaxFiles: ['FILE_UPLOAD_MAX_FILES', stringifiedIntegerZod(10)],
} as const;
