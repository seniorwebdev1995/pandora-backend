import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Public } from '../app/auth/decorators/public.decorator';
import { AppLogger } from '../app/logging/logging.service';
import { graphqlToMongoPagination } from '../app/pagination/pagination-args.graphql';
import { ListFaqQueryArgs } from './dto/list-faq-input.dto';
import { FAQ } from './faq.model';
import { FaqService } from './faq.service';

@Resolver(() => FAQ)
export class FaqResolver {
  constructor(private logger: AppLogger, private faqService: FaqService) {
    this.logger.setContext(this.constructor.name);
  }

  /* ================= QUERY =============== */
  @Public()
  @Query(() => [FAQ])
  async faq(@Args() { ...pagination }: ListFaqQueryArgs): Promise<FAQ[]> {
    this.logger.verbose('faq');
    return await this.faqService.getMany(
      graphqlToMongoPagination(pagination, { defaultLimit: 10, maxLimit: 50 }),
    );
  }

  @Public()
  @Mutation(() => Boolean)
  async addFaq(
    @Args('question') question: string,
    @Args('answer') answer: string,
  ): Promise<boolean> {
    this.logger.verbose('addFaq');
    await this.faqService.create(question, answer);
    return true;
  }
}
