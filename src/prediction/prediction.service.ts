import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreatePredictionDto } from './dto/create-prediction.dto';

import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';
import { handleExceptions } from 'src/common/helpers';
import { ClientProxy } from '@nestjs/microservices';
import { SCK_NATS_SERVICE } from 'src/config';
import { PrismaClient } from '@prisma/client';
import { PredictionInterface } from 'src/common/interfaces';
import { ChangePredictionStatusDto } from './dto/change-prediction-status.dto';

const execPromise = promisify(exec);

@Injectable()
export class PredictionService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PredictionService.name);

  constructor(@Inject(SCK_NATS_SERVICE) private readonly client: ClientProxy) {
    super()
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Data Analytics DB connected')
  }

  async runPrediction(createPredictionDto: CreatePredictionDto): Promise<PredictionInterface> {
    const { materialID, dataToAnalyze, purchaseInEvent, usageInEvent } = createPredictionDto
    const { totalQuantityUsed, totalQuantityPurchased, avgDailyUsed, avgTimeBetweenPurchases, lastPurchasedDate, usedTrend, daysSinceLastPurchase } = dataToAnalyze
    const pythonScriptPath = join('.', 'src', 'python', 'predict.py');

    try {
      const { stdout, stderr } = await execPromise(`python ${pythonScriptPath} ${materialID} ${totalQuantityUsed} ${totalQuantityPurchased} ${avgDailyUsed} ${avgTimeBetweenPurchases} ${lastPurchasedDate.toString().split('T')[0]} ${usedTrend} ${daysSinceLastPurchase} ${purchaseInEvent} ${usageInEvent}`);
      if (stderr) handleExceptions(stderr, this.logger)
      const result = JSON.parse(stdout)
      return {
        predictedQuantity: Math.round(+result.predicted_cantidad),
        predictedDays: Math.round(+result.predicted_dias),
        predictedDate: result.predicted_fecha,
      }
    } catch (error) {
      handleExceptions(error, this.logger)
    }
  }

  async createPrediction(createPredictionDto: CreatePredictionDto) {
    const { dataAnalyticsId, materialID } = createPredictionDto;
    const { predictedQuantity, predictedDays, predictedDate } = await this.runPrediction(createPredictionDto);

    try {
      const { id } = await this.prediction.create({
        data: {
          materialID,
          predictedQuantity,
          predictedDays,
          predictedDate: new Date(predictedDate),
          dataAnalyticsId,
        },
        select: {
          id: true,
        }
      })
      this.emitOrder(id, materialID, predictedQuantity, predictedDate, dataAnalyticsId)
      return id;
    } catch (error) {
      handleExceptions(error, this.logger)
    }
  }

  async updatePredictionStatus(changePredictionStatusDto: ChangePredictionStatusDto) {
    const { id, status } = changePredictionStatusDto;
    try {
      await this.prediction.update({
        where: { id },
        data: { status }
      })
    } catch (error) {
      handleExceptions(error, this.logger);
    }
  }

  private emitOrder(id: string, materialID: string, predictedQuantity: number, predictedDate: string, dataAnalyticsId: string) {
    try {
      this.client.emit('createOrder', {
        materialID,
        orderQuantity: predictedQuantity,
        predictedDate: new Date(predictedDate),
        predictionID: id,
        dataAnalyticsId,
      });
    } catch (error) {
      handleExceptions(error, this.logger)
    }
  }

}
