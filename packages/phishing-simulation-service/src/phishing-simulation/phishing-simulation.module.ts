import { Module } from '@nestjs/common';
import { PhishingSimulationService } from './phishing-simulation.service';
import { PhishingSimulationController } from './phishing-simulation.controller';

@Module({
  controllers: [PhishingSimulationController],
  providers: [PhishingSimulationService],
})
export class PhishingSimulationModule {}
