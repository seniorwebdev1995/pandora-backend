import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Analytic, AnalyticSchema } from './analytic.model';
import { AnalyticResolver } from './analytic.resolver';
import { AnalyticService } from './analytic.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Analytic.name, schema: AnalyticSchema }])],
  providers: [AnalyticService, AnalyticResolver],
  exports: [AnalyticService],
})
export class AnalyticModule {}
