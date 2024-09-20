import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { envs } from './config';

async function main() {
  const logger = new Logger('Main')

  const app = await NestFactory.create(AppModule);
  await app.listen(envs.port)

  logger.log(`Prediction Microservice running on port ${envs.port}`)

}
main();
