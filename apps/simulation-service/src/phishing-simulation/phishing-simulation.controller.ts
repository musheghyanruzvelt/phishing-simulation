import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { PhishingSimulationService } from './phishing-simulation.service';
import { CreatePhishingEmailDto } from './dto/create-phishing-email.dto';
import { PhishingAttemptStatus } from '@phishing-simulation/types';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Controller('phishing')
export class PhishingSimulationController {
  private readonly logger = new Logger(PhishingSimulationController.name);

  constructor(
    private readonly phishingSimulationService: PhishingSimulationService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  @Post('/send')
  async sendPhishingEmail(
    @Body() createPhishingEmailDto: CreatePhishingEmailDto,
  ) {
    this.logger.log(
      `Sending phishing email to: ${createPhishingEmailDto.recipientEmail}`,
    );
    return this.phishingSimulationService.sendPhishingEmail(
      createPhishingEmailDto,
    );
  }

  @Get('/track/:token')
  async trackPhishingClick(
    @Param('token') token: string,
    @Res() res: Response,
  ) {
    try {
      if (!token) {
        throw new BadRequestException('Token is required');
      }

      this.logger.log(`Phishing link clicked: ${token}`);

      const attemptId =
        await this.phishingSimulationService.validateTrackingToken(token);

      if (!attemptId) {
        throw new NotFoundException('Invalid or expired tracking link');
      }

      const updatedAttempt =
        await this.phishingSimulationService.updateAttemptStatus(
          attemptId,
          PhishingAttemptStatus.CLICKED,
        );

      if (updatedAttempt) {
        await this.rabbitMQService.publishLinkClicked(
          updatedAttempt.id as string,
        );

        this.logger.log(
          `Updated and notified for phishing attempt ${attemptId}`,
        );
      }

      res.set('Content-Type', 'image/gif');
      res.send(
        Buffer.from(
          'R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
          'base64',
        ),
      );
    } catch (error) {
      this.logger.error(
        `Error tracking phishing click: ${error.message}`,
        error.stack,
      );

      res.set('Content-Type', 'image/gif');
      res.send(
        Buffer.from(
          'R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
          'base64',
        ),
      );
    }
  }
}
