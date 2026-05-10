import { Module } from '@nestjs/common';
import { CelebrationsService } from './celebrations.service';
import { CelebrationsController } from './celebrations.controller';

@Module({
  providers: [CelebrationsService],
  controllers: [CelebrationsController],
})
export class CelebrationsModule {}
