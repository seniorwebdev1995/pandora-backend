import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { GoogleOauthController } from './google.controller';
import { GoogleService } from './google.service';

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [GoogleOauthController],
  providers: [GoogleService],
})
export class GoogleModule {}
