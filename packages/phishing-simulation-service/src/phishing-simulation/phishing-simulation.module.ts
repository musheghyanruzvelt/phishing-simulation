import { Module } from '@nestjs/common';
import { PhishingSimulationService } from './phishing-simulation.service';
import { PhishingSimulationController } from './phishing-simulation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PhishingAttemptSchema } from '../schemas/phishing-attempt.schema';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'PhishingAttempt', schema: PhishingAttemptSchema },
    ]),
    EmailModule,
  ],
  controllers: [PhishingSimulationController],
  providers: [PhishingSimulationService],
})
export class PhishingSimulationModule {}
