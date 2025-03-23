import { Module } from '@nestjs/common';
import { PhishingSimulationService } from './phishing-simulation.service';
import { PhishingSimulationController } from './phishing-simulation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PhishingAttemptSchema } from '@phishing-simulation/schemas';
import { EmailModule } from '../email/email.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'PhishingAttempt', schema: PhishingAttemptSchema },
    ]),
    EmailModule,
    RabbitMQModule,
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>(
                'RABBITMQ_URL',
                'amqp://localhost:5672',
              ),
            ],
            queue: configService.get<string>(
              'RABBITMQ_QUEUE',
              'phishing_events',
            ),
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [PhishingSimulationController],
  providers: [PhishingSimulationService],
})
export class PhishingSimulationModule {}
