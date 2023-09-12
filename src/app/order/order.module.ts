import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DealModule } from '../deal/deal.module';
import { UserModule } from '../user/user.module';
import { Order, OrderSchema } from './order.model';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';

@Module({
  imports: [
    forwardRef(() => DealModule),
    forwardRef(() => UserModule),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  providers: [OrderService, OrderResolver],
})
export class OrderModule {}
