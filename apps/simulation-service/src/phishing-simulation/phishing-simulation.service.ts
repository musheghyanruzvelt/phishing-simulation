import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { CreatePhishingEmailDto } from './dto/create-phishing-email.dto';
import {
  PhishingAttempt,
  PhishingAttemptStatus,
} from '@phishing-simulation/types';

@Injectable()
export class PhishingSimulationService {
  private readonly logger = new Logger(PhishingSimulationService.name);
  private readonly emailTransporter: nodemailer.Transporter;
  private readonly encryptionKey: Buffer;
  private readonly trackingUrl: string;

  constructor(
    @InjectModel('PhishingAttempt')
    private phishingAttemptModel: Model<PhishingAttempt>,
    private configService: ConfigService,
    private readonly mailService: EmailService,
  ) {
    const configKey = this.configService.get<string>('ENCRYPTION_KEY');

    if (configKey) {
      const keyBuffer = Buffer.from(configKey, 'hex');
      if (keyBuffer.length !== 32) {
        throw new Error(
          'ENCRYPTION_KEY must be a 64-character hex string (32 bytes)',
        );
      }
      this.encryptionKey = keyBuffer;
    } else {
      this.encryptionKey = crypto.randomBytes(32);
    }

    this.emailTransporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST', 'smtp.ethereal.email'),
      port: this.configService.get<number>('SMTP_PORT', 587),
      secure: this.configService.get<boolean>('SMTP_SECURE', false),
      auth: {
        user: this.configService.get<string>('SMTP_USER', ''),
        pass: this.configService.get<string>('SMTP_PASS', ''),
      },
    });

    this.trackingUrl = this.configService.get<string>(
      'TRACKING_URL',
      'http://localhost:3001/api/simulation/phishing/track',
    );
  }

  async sendPhishingEmail(
    createPhishingEmailDto: CreatePhishingEmailDto,
  ): Promise<PhishingAttempt> {
    try {
      const { recipientEmail, emailTemplate, createdBy } =
        createPhishingEmailDto;

      const phishingAttempt = await this.phishingAttemptModel.create({
        recipientEmail,
        emailContent: emailTemplate,
        status: PhishingAttemptStatus.PENDING,
        createdBy,
      });

      const trackingToken = this._generateTrackingToken(phishingAttempt.id);
      const trackingUrl = `${this.trackingUrl}/${trackingToken}`;

      phishingAttempt.trackingToken = trackingToken;
      await phishingAttempt.save();

      const modifiedContent = this._insertTrackingPixel(
        emailTemplate,
        trackingUrl,
      );

      await this.mailService.sendPhishingEmail({
        from: this.configService.get<string>('EMAIL_FROM', 'adobe@company.com'),
        to: recipientEmail,
        subject: 'Signature Required',
        html: modifiedContent,
      });

      this.logger.log(`Phishing email sent to: ${recipientEmail}`);

      await phishingAttempt.save();

      return phishingAttempt;
    } catch (error) {
      this.logger.error(
        `Error sending phishing email: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to send phishing email');
    }
  }

  async validateTrackingToken(token: string): Promise<string | null> {
    try {
      const decrypted = this.decryptToken(token);
      const attemptId = decrypted.id;

      const attempt = await this.phishingAttemptModel.findById(attemptId);
      if (!attempt) {
        this.logger.warn(`Attempt not found for token: ${token}`);
        return null;
      }

      if (attempt.trackingToken !== token) {
        this.logger.warn(`Token mismatch for attempt: ${attemptId}`);
        return null;
      }

      return attemptId;
    } catch (error) {
      this.logger.error(`Error validating tracking token: ${error.message}`);
      return null;
    }
  }

  private _generateTrackingToken(idOrReference: string): string {
    const data = {
      id: idOrReference,
      timestamp: Date.now(),
      random: Math.random().toString(36).substring(2, 15),
    };

    return this._encryptToken(data);
  }

  private _encryptToken(data: unknown): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey, iv);

    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return Buffer.from(`${iv.toString('hex')}:${encrypted}`).toString('base64');
  }

  private decryptToken(token: string) {
    try {
      const rawData = Buffer.from(token, 'base64').toString();
      const [ivHex, encryptedData] = rawData.split(':');

      const iv = Buffer.from(ivHex, 'hex');
      const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        this.encryptionKey,
        iv,
      );

      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return JSON.parse(decrypted);
    } catch (error) {
      this.logger.error(`Error decrypting token: ${error.message}`);
      throw error;
    }
  }

  private _insertTrackingPixel(
    emailContent: string,
    trackingUrl: string,
  ): string {
    return `${emailContent}
      <img src="${trackingUrl}" alt="" width="1" height="1" style="display:none" />
    `;
  }

  async updateAttemptStatus(
    attemptId: string,
    status: PhishingAttemptStatus,
  ): Promise<PhishingAttempt | null> {
    try {
      const attempt = await this.phishingAttemptModel.findById(attemptId);
      if (!attempt) {
        return null;
      }

      const previousStatus = attempt.status;
      attempt.status = status;

      await attempt.save();
      this.logger.log(
        `Updated attempt ${attemptId} status: ${previousStatus} → ${status}`,
      );

      return attempt;
    } catch (error) {
      this.logger.error(`Error updating attempt status: ${error.message}`);
      return null;
    }
  }
}
