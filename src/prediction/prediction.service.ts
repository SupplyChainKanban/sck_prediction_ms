import { Injectable } from '@nestjs/common';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { exec } from 'child_process';

@Injectable()
export class PredictionService {

  async runPrediction(createPredictionDto: CreatePredictionDto) {
    const { materialID, dataToAnalyze } = createPredictionDto
    const { totalQuantityUsed, totalQuantityPurchased, avgDailyUsed, avgTimeBetweenPurchases, lastPurchasedDate } = dataToAnalyze

    console.log('Entré')
    return new Promise((res, rej) => {

      console.log(lastPurchasedDate.toString().split('T')[0], avgTimeBetweenPurchases)
      exec(
        `python ./src/python/predictionModel.py ${materialID} ${totalQuantityUsed} ${totalQuantityPurchased} ${avgDailyUsed} ${15.8} ${lastPurchasedDate.toString().split('T')[0]}`,
        (error, stdout) => {
          if (error) return rej(error);

          const result = JSON.parse(stdout);
          res({
            nextPurchaseDate: new Date(result.nextPurchaseDate),
            nextPurchaseQuantity: result.nextPurchaseQuantity,
          })
        }
      )
    })

  }


  async createPrediction(createPredictionDto: CreatePredictionDto) {
    const predictionResult = await this.runPrediction(createPredictionDto);

    console.log({ predictionResult })




  }

}
