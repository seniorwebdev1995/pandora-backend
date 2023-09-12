import { Injectable } from '@nestjs/common';
import { baseConfigZod, Env, Protocol } from './base.config';
import { businessConfigZod } from './business.config';
import { createConfigFromEnv, InferConfig } from './helpers/create-config-from-env';
import { jwtConfigZod } from './jwt.config';
import { mongoConfigZod } from './mongo.config';
import { slackConfigZod } from './slack.config';
import { stripeConfigZod } from './stripe.config';

@Injectable()
export class ConfigService implements InferConfig<typeof baseConfigZod> {
  nodeEnv: Env;
  port: number;
  graphqlPlaygroundEnabled: boolean;
  protocol: Protocol;
  host: string;
  throttleTtl: number;
  fileUploadMaxSize: number;
  fileUploadMaxFiles: number;
  jwt: InferConfig<typeof jwtConfigZod>;
  mongo: InferConfig<typeof mongoConfigZod>;
  slack: InferConfig<typeof slackConfigZod>;
  stripe: InferConfig<typeof stripeConfigZod>;
  business: InferConfig<typeof businessConfigZod>;

  constructor() {
    const env = process.env;
    const baseConfig = createConfigFromEnv(baseConfigZod, env);
    Object.assign(this, {
      ...baseConfig,
      graphqlPlaygroundEnabled:
        baseConfig.graphqlPlaygroundEnabled ?? baseConfig.nodeEnv !== Env.production,
    });
    this.jwt = createConfigFromEnv(jwtConfigZod, env);
    this.mongo = createConfigFromEnv(mongoConfigZod, env);
    this.slack = createConfigFromEnv(slackConfigZod, env);
    this.stripe = createConfigFromEnv(stripeConfigZod, env);
    this.business = createConfigFromEnv(businessConfigZod, env);
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === Env.development;
  }

  get isProduction(): boolean {
    return this.nodeEnv === Env.production;
  }

  get isStaging(): boolean {
    return this.nodeEnv === Env.staging;
  }
}
