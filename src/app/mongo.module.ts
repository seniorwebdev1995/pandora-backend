import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { ConfigService } from './config/config.service';

export const mongoModule = MongooseModule.forRootAsync({
  imports: [],
  useFactory: (conf: ConfigService): MongooseModuleFactoryOptions => ({
    uri: conf.mongo.uri,
    retryAttempts: 3,
  }),
  inject: [ConfigService],
});
