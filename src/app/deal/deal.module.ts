import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from '../category/category.module';
import { PaginationModule } from '../pagination/pagination.module';
import { Deal, DealSchema } from './deal.model';
import { DealResolver } from './deal.resolver';
import { DealService } from './deal.service';

@Module({
  imports: [
    forwardRef(() => PaginationModule),
    forwardRef(() => CategoryModule),
    MongooseModule.forFeature([{ name: Deal.name, schema: DealSchema }]),
  ],
  providers: [DealService, DealResolver],
  exports: [DealService],
})
export class DealModule {}
