import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function main() {
  const logger = new Logger('Main')

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.NATS,
    options: {
      servers: envs.sckNatsServers,
    }
  })

  await app.listen();

  logger.log(`Prediction Microservice running on port ${envs.port}`)

}
main();
