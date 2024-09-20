import { Injectable } from '@nestjs/common';
import { CreatePredictionDto } from './dto/create-prediction.dto';

@Injectable()
export class PredictionService {
  create(createPredictionDto: CreatePredictionDto) {
    return 'This action adds a new prediction';
  }

}
