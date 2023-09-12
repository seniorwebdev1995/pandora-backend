import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { merge } from 'lodash';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../auth/types';
import { Category } from '../category/category.model';
import { CategoryService } from '../category/category.service';
import {
  assertNoneIsError,
  DataLoaderContextKey,
  getOrCreateDataloader,
} from '../helpers/get-or-create-dataloader';
import { AppLogger } from '../logging/logging.service';
import { AdminId } from '../user/model/admin.model';
import { CreateServiceInputDto } from './dto/create-service-input.dto';
import { ListServiceInput } from './dto/list-service-input.dto';
import { ListServicesOutputDto } from './dto/list-service-output.dto';
import { Service, ServiceId } from './service.model';
import { ServiceService } from './service.service';

@Resolver(() => Service)
export class ServiceResolver {
  constructor(
    private logger: AppLogger,
    private serviceService: ServiceService,
    private categoryService: CategoryService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /* ================= QUERY =============== */
  @Public()
  @Query(() => ListServicesOutputDto)
  async services(@Args('args') args: ListServiceInput): Promise<ListServicesOutputDto> {
    this.logger.verbose('deals');
    return await this.serviceService.getManyOld(merge(args, { criteria: { disabled: false } }));
  }

  /* ================= MUTATION =============== */
  //@Roles(Role.Admin)
  @Public()
  @Mutation(() => Service)
  async createService(@Args('form') form: CreateServiceInputDto): Promise<Service> {
    this.logger.verbose('createDeal');
    return await this.serviceService.create(form);
  }

  @Roles(Role.Admin)
  @Mutation(() => Boolean)
  async deleteService(
    @Args('serviceId') serviceId: ServiceId,
    @CurrentUserId() adminId: AdminId,
  ): Promise<boolean> {
    this.logger.verbose('deleteService');
    await this.serviceService.softDelete(serviceId, adminId);
    return true;
  }

  /* region ==================== RESOLVE FIELD ==================== */
  @ResolveField(() => [Category])
  async categories(@Parent() service: Service, @Context() context: object): Promise<Category[]> {
    const dataloader = getOrCreateDataloader(
      context,
      DataLoaderContextKey.CategoriesById,
      this.categoryService.createDataloaderById(),
    );
    return assertNoneIsError(await dataloader.loadMany(service.categorieIds));
  }
  /* endregion */
}
