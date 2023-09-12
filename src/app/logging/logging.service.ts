/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ConsoleLogger, Injectable, LoggerService, Scope } from '@nestjs/common';
import { ConfigService } from '../config/config.service';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger extends ConsoleLogger implements LoggerService {
  constructor(private conf: ConfigService) {
    // @InjectSlack()
    // private readonly slack: IncomingWebhook) {
    super();
  }

  private readonly slack = {
    send: (any: any) => {
      if (this.conf.isProduction) {
        // TODO: inject slack with new package since nestjs-slack-webhook is not NestJs 9.0 friendly
        console.log(any);
      }
    },
  };

  static _getTimeField() {
    const d = new Date();
    return {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: ':calendar: *Day:*\n' + d.toLocaleDateString('fr'),
        },
        {
          type: 'mrkdwn',
          text: ':alarm_clock: *Time:*\n' + d.toLocaleTimeString('fr'),
        },
      ],
    };
  }

  static _prettyStack(stack?: string) {
    if (!stack) {
      return [];
    }
    const group = stack.match(/^.*(at .*)*$/gm);
    if (group && group[0]) {
      group.shift();
      return group.map((g) => g.substring(7));
    }
    return [];
  }

  setContext(context: string) {
    super.context = context;
  }

  warn(message: any, context?: string) {
    if (this.conf.slack.warning) {
      this.slack.send({
        text: ':warning: Warning [' + context + ']',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: ':warning: Warning [' + context + ']',
            },
          },
          AppLogger._getTimeField(),
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*' + message + '*',
            },
          },
        ],
      });
    }
    super.warn(message, context);
  }

  verbose(message: unknown) {
    if (this.conf.isDevelopment) {
      super.verbose(message);
    }
  }

  error(message: string, stack?: string, context?: string) {
    const prettyStack = AppLogger._prettyStack(stack);
    if (this.conf.slack.error) {
      this.slack.send({
        text: ':boom: Error [' + context + ']',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: ':boom: Error [' + context + ']',
            },
          },
          AppLogger._getTimeField(),
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*' + message + '*',
            },
          },
          {
            type: 'section',
            text: {
              type: 'plain_text',
              text: prettyStack.join('\n'),
            },
          },
        ],
      });
    }
    super.error(message, stack, context);
  }

  gqlError(title: string, message: string, fieldName: string) {
    if (this.conf.slack.userError) {
      this.slack.send({
        text: ':face_with_hand_over_mouth: ApiError [' + title + ']',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: ':face_with_hand_over_mouth: ApiError [' + title + ']',
            },
          },
          AppLogger._getTimeField(),
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*' + fieldName + '*: ' + message,
            },
          },
        ],
      });
    }
    super.warn('GraphqlError [' + title + '] - ' + message);
  }
}
