import { Injectable } from '@nestjs/common';
import { CreatePredictionDto } from './dto/create-prediction.dto';

import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';

const execPromise = promisify(exec);

@Injectable()
export class PredictionService {

  async runPrediction(createPredictionDto: CreatePredictionDto) {
    const { materialID, dataToAnalyze, purchaseInEvent, usageInEvent } = createPredictionDto
    const { totalQuantityUsed, totalQuantityPurchased, avgDailyUsed, avgTimeBetweenPurchases, lastPurchasedDate, usedTrend, daysSinceLastPurchase } = dataToAnalyze

    const pythonScriptPath = join('.', 'src', 'python', 'predict.py');

    const { stdout, stderr } = await execPromise(`python ${pythonScriptPath} ${materialID} ${totalQuantityUsed} ${totalQuantityPurchased} ${avgDailyUsed} ${avgTimeBetweenPurchases} ${lastPurchasedDate.toString().split('T')[0]} ${usedTrend} ${daysSinceLastPurchase} ${purchaseInEvent} ${usageInEvent}`);

    if (stderr) {
      console.error(`Error: ${stderr}`);
      throw new Error(`Error executing Python script: ${stderr}`);
    }

    return stdout;

  }


  async createPrediction(createPredictionDto: CreatePredictionDto) {
    const predictionResult = await this.runPrediction(createPredictionDto);

    console.log({ predictionResult })

  }

}
