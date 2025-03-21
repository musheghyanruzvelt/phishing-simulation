import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/simulation');

  const configService = app.get(ConfigService);

  const PORT = configService.get<number>('PORT', 3002);

  await app.listen(PORT);

  logger.log(`Simulation service is running on http://localhost:${PORT}`);
}
bootstrap();
