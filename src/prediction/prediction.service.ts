import { Injectable, Logger } from '@nestjs/common';
import { CreatePredictionDto } from './dto/create-prediction.dto';

import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';
import { handleExceptions } from 'src/common/helpers';

const execPromise = promisify(exec);

@Injectable()
export class PredictionService {
  private readonly logger = new Logger('PredictionService');

  async runPrediction(createPredictionDto: CreatePredictionDto) {
    const { materialID, dataToAnalyze, purchaseInEvent, usageInEvent } = createPredictionDto
    const { totalQuantityUsed, totalQuantityPurchased, avgDailyUsed, avgTimeBetweenPurchases, lastPurchasedDate, usedTrend, daysSinceLastPurchase } = dataToAnalyze
    const pythonScriptPath = join('.', 'src', 'python', 'predict.py');

    try {
      const { stdout, stderr } = await execPromise(`python ${pythonScriptPath} ${materialID} ${totalQuantityUsed} ${totalQuantityPurchased} ${avgDailyUsed} ${avgTimeBetweenPurchases} ${lastPurchasedDate.toString().split('T')[0]} ${usedTrend} ${daysSinceLastPurchase} ${purchaseInEvent} ${usageInEvent}`);
      if (stderr) handleExceptions(stderr, this.logger)

      return stdout;
    } catch (error) {
      handleExceptions(error, this.logger)
    }
  }

  async createPrediction(createPredictionDto: CreatePredictionDto) {
    const { dataAnalyticsId } = createPredictionDto;
    const predictionResult = await this.runPrediction(createPredictionDto);

    console.log({ predictionResult })
  }
}
