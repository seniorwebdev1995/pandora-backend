import { z } from 'zod';
import { stringifiedBooleanZod } from './helpers/conversions';

export const slackConfigZod = {
  url: ['SLACK_CHANNEL_URL', z.string().url().optional()],
  warning: ['SLACK_SEND_WARNING', stringifiedBooleanZod(false)],
  health: ['SLACK_SEND_HEALTH', stringifiedBooleanZod(false)],
  error: ['SLACK_SEND_SERVOR_ERROR', stringifiedBooleanZod(false)],
  userError: ['SLACK_SEND_USER_ERROR', stringifiedBooleanZod(false)],
} as const;
