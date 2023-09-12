import { z } from 'zod';

export const jwtDelayRegex = /^(\d+)([smhd])$/;

const expirationDelayZod = z.string().regex(jwtDelayRegex);

export const jwtConfigZod = {
  secret: ['JWT_SECRET', z.string().default('tartelette-aux-framboises')],
  refreshExpire: ['REFRESH_JWT_EXPIRE', expirationDelayZod.default('30d')], // jwt format: 30 days
  authExpire: ['AUTH_JWT_EXPIRE', expirationDelayZod.default('1d')], // jwt format: 1 day
} as const;
