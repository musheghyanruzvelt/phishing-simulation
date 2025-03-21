import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PhishingAttempt } from '../auth/dto/create-user.dto';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Controller()
export class RabbitmqController {
  private readonly logger = new Logger(RabbitmqController.name);

  constructor(
    @InjectModel('PhishingAttempt')
    private phishingAttemptModel: Model<PhishingAttempt>,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  @EventPattern('phishing.link.clicked')
  async handlePhishingLinkClicked(
    @Payload() data: { attemptId: string; timestamp: string },
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.logger.log(
      `Processing phishing.link.clicked event: ${JSON.stringify(data)}`,
    );

    try {
      const { attemptId, timestamp } = data;

      const attempt = await this.phishingAttemptModel.findById(attemptId);
      if (!attempt) {
        this.logger.warn(`Phishing attempt not found: ${attemptId}`);
        channel.ack(originalMsg);
        return;
      }

      const previousStatus = attempt.status;

      attempt.status = 'CLICKED';
      attempt.clickedAt = new Date(timestamp || Date.now());
      await attempt.save();

      this.logger.log(
        `Updated phishing attempt status: ${attemptId} -> CLICKED`,
      );

      // this.websocketGateway.notifyPhishingAttemptUpdate(attempt);
      this.websocketGateway.notifyPhishingAttemptStatusChange(
        attempt,
        previousStatus,
      );

      channel.ack(originalMsg);
    } catch (error) {
      this.logger.error(
        `Error processing phishing.link.clicked event: ${error.message}`,
      );
      channel.nack(originalMsg, false, true);
    }
  }
}
