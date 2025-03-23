import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PhishingEvent } from '@phishing-simulation/types';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RabbitMQService {
  private readonly logger = new Logger(RabbitMQService.name);

  constructor(
    @Inject('PHISHING_SIMULATION_SERVICE') private client: ClientProxy,
  ) {}

  async publishLinkClicked(attemptId: string): Promise<void> {
    try {
      console.log(attemptId, 'id');
      await firstValueFrom(
        this.client.emit(PhishingEvent.LINK_CLICKED, {
          attemptId,
        }),
      );
    } catch (error) {
      this.logger.error(`Error publishing link clicked event: ${error}`);
      throw error;
    }
  }
}
