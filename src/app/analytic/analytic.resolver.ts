import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserId } from 'aws-sdk/clients/appstream';
import { OptionalCurrentUserId } from '../auth/decorators/current-user-id.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { AppLogger } from '../logging/logging.service';
import { Analytic } from './analytic.model';
import { AnalyticService } from './analytic.service';
import { PushEventInputDto } from './dto/push-event-input.dto';

@Resolver(() => Analytic)
export class AnalyticResolver {
  constructor(private logger: AppLogger, private service: AnalyticService) {
    this.logger.setContext(this.constructor.name);
  }

  /* ================= MUTATION =============== */
  @Public()
  @Mutation(() => Analytic)
  async pushEvent(
    @Args() form: PushEventInputDto,
    @OptionalCurrentUserId() userId: UserId,
  ): Promise<Analytic> {
    this.logger.verbose('pushEvent');
    return await this.service.create(form, userId);
  }
}
