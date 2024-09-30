import { Injectable } from '@nestjs/common';
import { CreatePredictionDto } from './dto/create-prediction.dto';

import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';

const execPromise = promisify(exec);

@Injectable()
export class PredictionService {

  async runPrediction(createPredictionDto: CreatePredictionDto) {
    const { materialID, dataToAnalyze } = createPredictionDto
    const { totalQuantityUsed, totalQuantityPurchased, avgDailyUsed, avgTimeBetweenPurchases, lastPurchasedDate, usedTrend, daysSinceLastPurchase } = dataToAnalyze

    const inputData = {
      materialID,
      totalQuantityUsed,
      totalQuantityPurchased,
      lastPurchasedDate: lastPurchasedDate.toString().split('T')[0],
      avgDailyUsed,
      usedTrend,
      avgTimeBetweenPurchases,
      daysSinceLastPurchase,
    }
    const inputString: string = JSON.stringify(inputData);

    const pythonScriptPath = join('.', 'src', 'python', 'predict.py');

    // return new Promise((res, rej) => {

    // console.log(lastPurchasedDate.toString().split('T')[0], avgTimeBetweenPurchases)
    // exec(
    //   `python ./src/python/predict.py ${materialID} ${totalQuantityUsed} ${totalQuantityPurchased} ${avgDailyUsed} ${avgTimeBetweenPurchases} ${lastPurchasedDate.toString().split('T')[0]}`,
    //   (error, stdout) => {
    //     if (error) return rej(error);

    //     const result = JSON.parse(stdout);
    //     res({
    //       nextPurchaseDate: new Date(result.nextPurchaseDate),
    //       nextPurchaseQuantity: result.nextPurchaseQuantity,
    //     })
    //   }
    // )


    // })

    // Ejecutar el script de Python
    // const { stdout, stderr } = await execPromise(`python ${pythonScriptPath} "${inputString}"`);
    const { stdout, stderr } = await execPromise(`python ${pythonScriptPath} ${materialID} ${totalQuantityUsed} ${totalQuantityPurchased} ${avgDailyUsed} ${avgTimeBetweenPurchases} ${lastPurchasedDate.toString().split('T')[0]} ${usedTrend} ${daysSinceLastPurchase}`);

    if (stderr) {
      console.error(`Error: ${stderr}`);
      throw new Error(`Error executing Python script: ${stderr}`);
    }

    // console.log({ stdout })
    return stdout;



  }


  async createPrediction(createPredictionDto: CreatePredictionDto) {
    const predictionResult = await this.runPrediction(createPredictionDto);

    console.log({ predictionResult })

  }

}
