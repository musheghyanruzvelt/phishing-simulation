import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PhishingAttemptsController } from './phishing-attempts.controller';
import { AuthModule } from '../auth/auth.module';
import { WebsocketModule } from '../websocket/websocket.module';
import { PhishingAttemptSchema } from '@phishing-simulation/schemas';
import { PhishingAttemptsService } from './phishing-attempts.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'PhishingAttempt', schema: PhishingAttemptSchema },
    ]),
    AuthModule,
    WebsocketModule,
  ],
  controllers: [PhishingAttemptsController],
  providers: [PhishingAttemptsService],
})
export class PhishingAttemptsModule {}
