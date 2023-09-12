import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Public } from '../auth/decorators/public.decorator';
import { Category } from '../category/category.model';
import { CategoryService } from '../category/category.service';
import {
  assertNoneIsError,
  DataLoaderContextKey,
  getOrCreateDataloader,
} from '../helpers/get-or-create-dataloader';
import { AppLogger } from '../logging/logging.service';
import { graphqlToMongoPagination } from '../pagination/pagination-args.graphql';
import { ListDealType } from './deal-type';
import { Deal } from './deal.model';
import { DealService } from './deal.service';
import { CreateDealEmailInputDto } from './dto/create-deal-email-input.dto';
import { CreateDealPromoCodeInputDto } from './dto/create-deal-promocode-input.dto';
import { CreateDealWalletInputDto } from './dto/create-deal-wallet-input.dto';
import { ListDealInput } from './dto/list-deal-input.dto';

@Resolver(() => Deal)
export class DealResolver {
  constructor(
    private logger: AppLogger,
    private dealService: DealService,
    private categoryService: CategoryService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /* ================= QUERY =============== */
  @Public()
  @Query(() => [Deal])
  async deals(@Args() { filter, ...pagination }: ListDealInput): Promise<Deal[]> {
    this.logger.verbose('deals');
    return await this.dealService.getMany(
      filter,
      graphqlToMongoPagination(pagination, { defaultLimit: 10, maxLimit: 50 }),
    );
  }

  /* ================= MUTATION =============== */
  @Public()
  @Mutation(() => Deal)
  async createDealPromoCode(@Args('form') form: CreateDealPromoCodeInputDto): Promise<Deal> {
    this.logger.verbose('createDealPromoCode');
    return await this.dealService.create(form, {
      promoCode: form.promoCode,
      quantity: form.quantity,
      kind: ListDealType.PromoCode,
    });
  }

  @Public()
  @Mutation(() => Deal)
  async createDealIntroEmail(@Args('form') form: CreateDealEmailInputDto): Promise<Deal> {
    this.logger.verbose('createDealIntroEmail');
    return await this.dealService.create(form, {
      contactEmail: form.contactEmail,
      kind: ListDealType.IntroEmail,
    });
  }

  @Public()
  @Mutation(() => Deal)
  async createDealWallet(@Args('form') form: CreateDealWalletInputDto): Promise<Deal> {
    this.logger.verbose('createDealWallet');
    return await this.dealService.create(form, {
      collectionWallet: form.collectionWallet,
      promoCode: form.promoCode,
      kind: ListDealType.Wallet,
    });
  }

  /* region ==================== RESOLVE FIELD ==================== */
  @ResolveField(() => [Category])
  async categories(@Parent() deal: Deal, @Context() context: object): Promise<Category[]> {
    const dataloader = getOrCreateDataloader(
      context,
      DataLoaderContextKey.CategoriesById,
      this.categoryService.createDataloaderById(),
    );
    return assertNoneIsError(await dataloader.loadMany(deal.categoriesIds));
  }

  /* endregion */
}
