import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PredictionService } from './prediction.service';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { UpdatePredictionDto } from './dto/update-prediction.dto';

@Controller()
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @MessagePattern('createPrediction')
  create(@Payload() createPredictionDto: CreatePredictionDto) {
    return this.predictionService.create(createPredictionDto);
  }

  @MessagePattern('findAllPrediction')
  findAll() {
    return this.predictionService.findAll();
  }

  @MessagePattern('findOnePrediction')
  findOne(@Payload() id: number) {
    return this.predictionService.findOne(id);
  }

  @MessagePattern('updatePrediction')
  update(@Payload() updatePredictionDto: UpdatePredictionDto) {
    return this.predictionService.update(updatePredictionDto.id, updatePredictionDto);
  }

  @MessagePattern('removePrediction')
  remove(@Payload() id: number) {
    return this.predictionService.remove(id);
  }
}
