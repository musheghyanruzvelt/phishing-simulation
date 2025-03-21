import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/attempts');

  const configService = app.get(ConfigService);

  const PORT = configService.get<number>('PORT', 3002);

  await app.listen(PORT);

  logger.log(`Management Server is running on http://localhost:${PORT}`);
}

bootstrap();
