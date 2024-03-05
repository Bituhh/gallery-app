import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import {CONFIGURATION_SERVICE_TOKEN} from '@nestjs/config/dist/config.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  })
  await app.listen(process.env.BACKEND_PORT ?? 3000);
}
bootstrap();
