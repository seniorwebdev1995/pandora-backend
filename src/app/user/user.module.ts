import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminActionModule } from '../helpers/admin-action/admin-action.module';
import { AllUserService } from './all-user.service';
import { Admin, AdminSchema } from './model/admin.model';
import { User, UserSchema } from './model/user.model';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Admin.name, schema: AdminSchema },
    ]),
    AdminActionModule,
  ],
  providers: [AllUserService, UserService, UserResolver],
  exports: [AllUserService, UserService],
})
export class UserModule {}
