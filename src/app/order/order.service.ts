import { InjectModel } from '@nestjs/mongoose';
import { UserId } from 'aws-sdk/clients/appstream';
import { Model } from 'mongoose';
import { ListDealType } from '../deal/deal-type';
import { DealService } from '../deal/deal.service';
import { AppLogger } from '../logging/logging.service';
import { UserService } from '../user/user.service';
import { OrderOutputDto } from './dto/order-output.dto';
import { RedeemOrderInput } from './dto/redeem-order-input.dto';
import { Order } from './order.model';

export class OrderService {
  constructor(
    private logger: AppLogger,
    @InjectModel(Order.name) private model: Model<Order>,
    private readonly dealService: DealService,
    private readonly userService: UserService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async create(form: RedeemOrderInput, currentUserId: UserId): Promise<OrderOutputDto> {
    const deal = await this.dealService.getByIdOrThrow(form.dealId);
    await this.dealService.increaseRedeemAmunt(form.dealId);
    const doc = (
      await this.model.create({
        ...form,
        buyerId: currentUserId,
        type: deal.type,
      })
    ).toObject();

    if (deal.type.kind == ListDealType.PromoCode) {
      return {
        promoCode: deal.type.promoCode,
      };
    }
    // todo : to make intro
    return {};
  }
}
