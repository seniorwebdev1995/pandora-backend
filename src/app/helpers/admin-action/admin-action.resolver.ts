import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Role } from '../../auth/types';
import { AppLogger } from '../../logging/logging.service';
import { AllUserService } from '../../user/all-user.service';
import { Admin } from '../../user/model/admin.model';
import { AdminAction } from './admin-action.model';

@Resolver(() => AdminAction)
export class AdminActionResolver {
  constructor(private logger: AppLogger, private allUserService: AllUserService) {
    this.logger.setContext(this.constructor.name);
  }

  @ResolveField(() => Admin)
  async admin(@Parent() action: AdminAction): Promise<Admin> {
    return await this.allUserService.getByIdOrThrow(action.adminId, Role.Admin);
  }
}
