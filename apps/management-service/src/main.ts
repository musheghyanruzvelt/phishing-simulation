import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SocketIoAdapter } from './adapter/socket-io.adapter';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api/management');

  const configService = app.get(ConfigService);

  const PORT = configService.get<number>('PORT', 3002);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        configService.get<string>(
          'RABBITMQ_URL',
          'amqp://rabbit:rabbit@localhost:5672',
        ),
      ],
      queue: 'phishing_events_queue',
      queueOptions: {
        durable: true,
      },
      noAck: false,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN', '*'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useWebSocketAdapter(new SocketIoAdapter(app));

  await app.startAllMicroservices();

  await app.listen(PORT);

  logger.log(`Management Server is running on http://localhost:${PORT}`);
}

bootstrap();
