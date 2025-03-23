import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

interface SendPhishingEmailOptions {
  to: string;
  subject: string;
  from?: string;
  html: string;
}

@Injectable()
export class EmailService implements OnModuleInit {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);
  private testAccount: nodemailer.TestAccount | null = null;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const smtpHost = this.configService.get<string>('SMTP_HOST');

    // If no SMTP host is configured, create a test account
    if (!smtpHost) {
      this.logger.log('No SMTP configuration found, creating test account');
      await this.setupTestAccount();
    } else {
      // Use configured SMTP server
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: this.configService.get<number>('SMTP_PORT', 587),
        secure: this.configService.get<boolean>('SMTP_SECURE', false),
        auth: {
          user: this.configService.get<string>('SMTP_USER', ''),
          pass: this.configService.get<string>('SMTP_PASS', ''),
        },
      });

      await this.verifyConnection();
    }
  }

  private async setupTestAccount() {
    try {
      this.testAccount = await nodemailer.createTestAccount();

      this.logger.log('Created Ethereal test account:');
      this.logger.log(`- Username: ${this.testAccount.user}`);
      this.logger.log(`- Password: ${this.testAccount.pass}`);
      this.logger.log('View sent emails at: https://ethereal.email');

      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: this.testAccount.user,
          pass: this.testAccount.pass,
        },
      });

      await this.verifyConnection();
    } catch (error) {
      this.logger.error(
        `Failed to create test account: ${error.message}`,
        error.stack,
      );
    }
  }

  async sendPhishingEmail(options: SendPhishingEmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from:
          options.from ||
          this.configService.get(
            'EMAIL_FROM',
            '"Phishing Simulator" <noreply@example.com>',
          ),
        to: options.to,
        subject: options.subject,
        html: options.html,
      };

      const info = await this.transporter.sendMail(mailOptions);

      this.logger.log(`Phishing email sent to ${options.to}`);

      // If using Ethereal, provide the preview URL
      if (this.testAccount) {
        this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    } catch (error) {
      this.logger.error('Failed to send phishing email', error);
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
}
