import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import {
  PhishingAttempt,
  PhishingAttemptStatus,
  PhishingEvent,
} from '@phishing-simulation/types';

interface PhishingClickEvent {
  attemptId: string;
}

@Controller()
export class RabbitmqController {
  private readonly logger = new Logger(RabbitmqController.name);

  constructor(
    @InjectModel('PhishingAttempt')
    private phishingAttemptModel: Model<PhishingAttempt>,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  @EventPattern(PhishingEvent.LINK_CLICKED)
  async handlePhishingLinkClicked(
    @Payload() data: PhishingClickEvent,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.logger.log(
      `Processing phishing click event for ID: ${data.attemptId}`,
    );

    try {
      const attempt = await this._updateAttemptStatus(data);

      if (!attempt) {
        channel.ack(originalMsg);
        return;
      }

      this.websocketGateway.notifyPhishingAttemptStatusChange(
        attempt,
        attempt.previousStatus,
      );

      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(`Error processing click event: ${error.message}`);

      channel.nack(originalMsg, false, true);
    }
  }

  private async _updateAttemptStatus(
    data: PhishingClickEvent,
  ): Promise<(PhishingAttempt & { previousStatus: string }) | null> {
    const { attemptId } = data;

    const attempt = await this.phishingAttemptModel.findById(attemptId);
    if (!attempt) {
      this.logger.warn(`Phishing attempt not found: ${attemptId}`);
      return null;
    }

    const previousStatus = attempt.status;

    if (attempt.status !== PhishingAttemptStatus.CLICKED) {
      attempt.status = PhishingAttemptStatus.CLICKED;

      await attempt.save();

      this.logger.log(
        `Updated attempt ${attemptId} status: ${previousStatus} → CLICKED`,
      );
    } else {
      this.logger.log(
        `Attempt ${attemptId} already marked as clicked, skipping update`,
      );
    }

    return { ...attempt.toObject(), previousStatus };
  }
}
