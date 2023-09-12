import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '../config/config.service';
import { UserModule } from '../user/user.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { EndpointAuthMetadataManager } from './endpoint-auth-metadata-manager.service';

@Global()
@Module({
  imports: [
    HttpModule,
    PassportModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (cf: ConfigService) => ({
        secret: cf.jwt.secret,
        signOptions: { expiresIn: cf.jwt.authExpire },
      }),
    }),
  ],
  controllers: [],
  providers: [AuthResolver, AuthService, EndpointAuthMetadataManager],
  exports: [AuthService, EndpointAuthMetadataManager],
})
export class AuthModule {}
