import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

interface SendPhishingEmailOptions {
  to: string;
  subject: string;
  from: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<boolean>('SMTP_SECURE', false),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });

    this.verifyConnection();
  }

  async sendPhishingEmail(options: SendPhishingEmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: this.configService.get(
          'EMAIL_FROM',
          '"Phishing Simulator" <noreply@example.com>',
        ),
        to: options.to,
        subject: options.subject,
        html: options.html,
      };

      const info = await this.transporter.sendMail(mailOptions);

      this.logger.log(`Phishing email sent to ${options.to}`);
      this.logger.log(`Email sent info: ${JSON.stringify(info)}`);
    } catch (error) {
      this.logger.error('Failed to send phishing email', error);

      if (error instanceof Error) {
        this.logger.error(`Error name: ${error.name}`);
        this.logger.error(`Error message: ${error.message}`);
        this.logger.error(`Error stack: ${error.stack}`);
      }

      throw error;
    }
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      this.logger.log('SMTP connection verified successfully');
    } catch (error) {
      this.logger.error(
        `Failed to verify SMTP connection: ${error.message}`,
        error.stack,
      );
    }
  }

  async createTestAccount() {
    try {
      const testAccount = await nodemailer.createTestAccount();

      this.logger.log(`Created test SMTP account: ${testAccount.user}`);

      // Create a test transporter
      const testTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      return {
        transporter: testTransporter,
        account: testAccount,
      };
    } catch (error) {
      this.logger.error(
        `Failed to create test account: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
