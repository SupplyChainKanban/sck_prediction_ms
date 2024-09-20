import { Module } from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { PredictionController } from './prediction.controller';
import { TransportsModule } from 'src/transports/transports.module';

@Module({
  controllers: [PredictionController],
  providers: [PredictionService],
  imports: [TransportsModule]
})
export class PredictionModule { }
