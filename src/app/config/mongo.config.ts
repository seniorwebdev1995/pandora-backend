import { z } from 'zod';

export const mongoConfigZod = {
  uri: ['MONGO_URI', z.string().url()],
} as const;
