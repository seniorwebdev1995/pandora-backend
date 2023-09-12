import { Global, Module } from '@nestjs/common';
import { AppLogger } from './logging.service';

@Global()
@Module({
  providers: [AppLogger],
  exports: [AppLogger],
})
export class LoggingModule {}
