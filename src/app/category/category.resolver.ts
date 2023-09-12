import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../auth/types';
import { AppLogger } from '../logging/logging.service';
import { graphqlToMongoPagination } from '../pagination/pagination-args.graphql';
import { AdminId } from '../user/model/admin.model';
import { Category, CategoryId } from './category.model';
import { CategoryService } from './category.service';
import { ListCategoriesQueryArgs } from './dto/list-categories-input.dto';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private logger: AppLogger, private categoryService: CategoryService) {
    this.logger.setContext(this.constructor.name);
  }

  /* ================= QUERY =============== */
  @Public()
  @Query(() => [Category])
  async categories(
    @Args() { filter, ...pagination }: ListCategoriesQueryArgs,
  ): Promise<Category[]> {
    this.logger.verbose('categories');
    return await this.categoryService.getMany(
      filter,
      graphqlToMongoPagination(pagination, { defaultLimit: 10, maxLimit: 50 }),
    );
  }

  /* ================= MUTATION =============== */
  // @Roles(Role.Admin)
  // @Public()
  // @Mutation(() => Category)
  // async createCategory(
  //   @Args('name') name: string,
  //   @Args('imageUrl') imageUrl: string,
  // ): Promise<Category> {
  //   this.logger.verbose('createCategory');
  //   await this.categoryService.create('No code', 'www.google.fr/blablabla.png');
  //   await this.categoryService.create('NFT', 'www.google.fr/blablabla.png');
  //   await this.categoryService.create('DEFI', 'www.google.fr/blablabla.png');
  //   await this.categoryService.create('ICO', 'www.google.fr/blablabla.png');
  //   await this.categoryService.create('Tools', 'www.google.fr/blablabla.png');
  //   await this.categoryService.create('Utility', 'www.google.fr/blablabla.png');
  //   await this.categoryService.create('Tokenomics', 'www.google.fr/blablabla.png');
  //   await this.categoryService.create('Agency', 'www.google.fr/blablabla.png');
  //   return await this.categoryService.create('Audit', 'www.google.fr/blablabla.png');
  // }

  @Roles(Role.Admin)
  @Mutation(() => Boolean)
  async deleteCategory(
    @Args('categoryId') categoryId: CategoryId,
    @CurrentUserId() adminId: AdminId,
  ): Promise<boolean> {
    this.logger.verbose('deleteCategory');
    await this.categoryService.softDelete(categoryId, adminId);
    return true;
  }
}
