import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { FaqModule } from '../faq/faq.module';
import { AnalyticModule } from './analytic/analytic.module';
import { AuthModule } from './auth/auth.module';
import { EndpointAuthMonitorGuard } from './auth/guards/endpoint-auth-monitor.guard';
import { CategoryModule } from './category/category.module';
import { ConfigModule } from './config/config.module';
import { DealModule } from './deal/deal.module';
import { GoogleModule } from './google/google.module';
import { graphqlModule } from './graphql.module';
import { mongoModule } from './mongo.module';
import { OrderModule } from './order/order.module';
import { ServiceModule } from './service/service.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    mongoModule,
    graphqlModule,

    /* APPLICATION MODULES */
    AuthModule,
    UserModule,
    CategoryModule,
    DealModule,
    ServiceModule,
    AnalyticModule,
    GoogleModule,
    OrderModule,
    FaqModule,
  ],
  providers: [
    {
      // Make sure any endpoint is protected by an auth policy.
      provide: APP_GUARD,
      useClass: EndpointAuthMonitorGuard,
    },
  ],
})
export class AppModule {}

export class AppStartedEvent {
  static symbol = Symbol(AppStartedEvent.name);
  baseUrl: URL;
}
