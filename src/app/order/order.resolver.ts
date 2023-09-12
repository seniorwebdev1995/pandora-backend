import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserId } from 'aws-sdk/clients/appstream';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';
import { Roles } from '../auth/decorators/role.decorator';
import { Role } from '../auth/types';
import { AppLogger } from '../logging/logging.service';
import { OrderOutputDto } from './dto/order-output.dto';
import { RedeemOrderInput } from './dto/redeem-order-input.dto';
import { Order } from './order.model';
import { OrderService } from './order.service';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private logger: AppLogger, private orderService: OrderService) {
    this.logger.setContext(this.constructor.name);
  }

  /* ================= MUTATION =============== */
  @Roles(Role.User)
  @Mutation(() => OrderOutputDto)
  async redeemOffer(
    @Args() form: RedeemOrderInput,
    @CurrentUserId() currentUserId: UserId,
  ): Promise<OrderOutputDto> {
    this.logger.verbose('redeemOffer');
    return await this.orderService.create(form, currentUserId);
  }
  /* endregion */
}
