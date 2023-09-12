import { z } from 'zod';

export const stripeConfigZod = {
  secret: ['STRIPE_SECRET_KEY', z.string()],
  webhookSecret: ['STRIPE_WEBHOOK_SECRET_KEY', z.string()],
} as const;
