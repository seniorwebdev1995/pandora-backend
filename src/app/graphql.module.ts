import { authZApolloPlugin } from '@graphql-authz/apollo-server-plugin';
import { authZDirective, authZGraphQLDirective } from '@graphql-authz/directive';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthenticationError } from 'apollo-server-express';
import { Request } from 'express';
import { typeDefs as scalarTypeDefs } from 'graphql-scalars';
import path, { join } from 'path';
import { z } from 'zod';
import { AppStartedEvent } from './app.module';
import { AuthService } from './auth/auth.service';
import { authZRules } from './auth/authz/authz-rules';
import { extractBearerToken } from './auth/helpers/extract-bearer-token';
import { AuthTokenPayload, TokenType } from './auth/types';
import { Env } from './config/base.config';
import { ConfigService } from './config/config.service';
import { prettyErrorsHelper } from './helpers/pretty-graphql-errors.tools';
import { LoggingModule } from './logging/logging.module';
import { AppLogger } from './logging/logging.service';

export const GRAPHQL_PATH = 'graphql';

const { authZDirectiveTransformer } = authZDirective();

export const graphqlModule = GraphQLModule.forRootAsync<ApolloDriverConfig>({
  imports: [LoggingModule, EventEmitterModule],
  driver: ApolloDriver,
  useFactory: (
    conf: ConfigService,
    logger: AppLogger,
    authService: AuthService,
    eventEmitter: EventEmitter2,
  ) => {
    const playgroundEnabled = conf.graphqlPlaygroundEnabled;
    if (playgroundEnabled) {
      eventEmitter.on(AppStartedEvent.symbol, (event: AppStartedEvent) => {
        const playgroundUrl = new URL(event.baseUrl.href);
        playgroundUrl.pathname = path.join(playgroundUrl.pathname, GRAPHQL_PATH);
        logger.log(`GraphQL Playground available at ${playgroundUrl.href}`);
      });
    }
    return {
      path: GRAPHQL_PATH,
      autoSchemaFile: join(process.cwd(), './dist/schema.gql'),
      // installSubscriptionHandlers: true,
      subscriptions: {
        'graphql-ws': true, // New protocol in favor.
        'subscriptions-transport-ws': true, // Legacy for older clients.
      },
      transformSchema: (schema) => authZDirectiveTransformer(schema),
      transformAutoSchemaFile: true,
      debug: [Env.development, Env.staging].includes(conf.nodeEnv),
      sortSchema: true,
      uploads: false,
      autoTransformHttpErrors: true,
      playground: playgroundEnabled,
      formatError: prettyErrorsHelper(conf.nodeEnv),
      plugins: [authZApolloPlugin({ rules: authZRules })],
      buildSchemaOptions: {
        directives: [authZGraphQLDirective(authZRules)],
      },
      typeDefs: [...scalarTypeDefs],
      context: (ctx: { req: Request }) => {
        // Because we use AuthZ which can run BEFORE any NestJS guard, we need to resolve
        // the JWT manually, instead of using a conventional NestJS JwtGuard.
        const { req } = ctx;
        if (!req) {
          // This is not a request. Probably a websocket connection. Nothing to do.
          return;
        }
        try {
          const authenticationHeader = z.string().optional().safeParse(req.headers.authorization);
          if (!authenticationHeader.success) {
            throw new AuthenticationError('Invalid authorization header');
          }
          if (authenticationHeader.data) {
            const authenticationToken = extractBearerToken(authenticationHeader.data);
            const tokenPayload = authService.verifyToken(authenticationToken);
            if (tokenPayload.type !== TokenType.Auth) {
              throw new AuthenticationError(
                `Expected Auth token. Received ${tokenPayload.type} token`,
              );
            }
            req.jwtPayload = tokenPayload;
          }
        } catch (error) {
          logger.verbose(error.message);
          // Write the error but do not throw, since this may be a public endpoint.
          // It will be checked later by the guards.
          req.jwtPayload = undefined;
          req.jwtPayloadError = error;
        }
        return ctx;
      },
    };
  },
  inject: [ConfigService, AppLogger, AuthService, EventEmitter2],
});

declare module 'express' {
  interface Request {
    user: never;
    jwtPayload?: AuthTokenPayload;
    jwtPayloadError?: Error;
  }
}
