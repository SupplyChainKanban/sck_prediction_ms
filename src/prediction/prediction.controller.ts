import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { PredictionService } from './prediction.service';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { ChangePredictionStatusDto } from './dto/change-prediction-status.dto';

@Controller()
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) { }

  @EventPattern('generate.prediction')
  @MessagePattern('generate.prediction')
  create(@Payload() createPredictionDto: CreatePredictionDto) {
    return this.predictionService.createPrediction(createPredictionDto);
  }

  @EventPattern('update.prediction.status')
  @MessagePattern('update.prediction.status')
  updatePredictionStatus(@Payload() changePredictionStatusDto: ChangePredictionStatusDto) {
    return this.predictionService.updatePredictionStatus(changePredictionStatusDto);
  }

}
