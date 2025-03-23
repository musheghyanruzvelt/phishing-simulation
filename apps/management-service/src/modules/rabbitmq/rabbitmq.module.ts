import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitmqController } from './rabbitmq.controller';
import { WebsocketModule } from '../websocket/websocket.module';
import { PhishingAttemptSchema } from '@phishing-simulation/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'PhishingAttempt', schema: PhishingAttemptSchema },
    ]),
    WebsocketModule,
  ],
  controllers: [RabbitmqController],
})
export class RabbitmqModule {}
