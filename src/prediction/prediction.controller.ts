import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PredictionService } from './prediction.service';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { UpdatePredictionDto } from './dto/update-prediction.dto';

@Controller()
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) { }

  @MessagePattern('generate.prediction')
  create(@Payload() createPredictionDto: CreatePredictionDto) {
    return this.predictionService.create(createPredictionDto);
  }

}
