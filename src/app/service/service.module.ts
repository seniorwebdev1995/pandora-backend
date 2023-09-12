import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from '../category/category.module';
import { PaginationModule } from '../pagination/pagination.module';
import { Service, ServiceSchema } from './service.model';
import { ServiceResolver } from './service.resolver';
import { ServiceService } from './service.service';

@Module({
  imports: [
    forwardRef(() => PaginationModule),
    forwardRef(() => CategoryModule),
    MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema }])],
  providers: [ServiceService, ServiceResolver],
  exports: [ServiceService],
})
export class ServiceModule {}
