import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '../../user/user.module';
import { AdminActionResolver } from './admin-action.resolver';

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [AdminActionResolver],
})
export class AdminActionModule {}
