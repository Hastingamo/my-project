import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

interface SendMailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: this.configService.get<string>('MAIL_SECURE') === 'true',
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });

    this.logger.log(`Mail transporter ready: ${this.configService.get('MAIL_USER')}`);
  }

  async sendMail({ to, subject, text, html }: SendMailOptions) {
    const info = await this.transporter.sendMail({
      from: '"dams car seller" <no-reply@myapp.com>',
      to,
      subject,
      text,
      html,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    this.logger.log(`Message sent: ${info.messageId}`);
    this.logger.log(`Preview URL: ${previewUrl}`);

    return {
      messageId: info.messageId,
      previewUrl,
    };
  }

  async sendPasswordResetEmail(to: string, resetToken: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    const html = `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Reset your password</h2>
        <p>We received a request to reset your password. Click the button below to choose a new one.</p>
        <p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background: #4f46e5; color: #fff; text-decoration: none; border-radius: 6px;">
            Reset Password
          </a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p>${resetLink}</p>
        <p>This link will expire in 1hrs. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `;

    return this.sendMail({
      to,
      subject: 'Reset your password',
      text: `Reset your password using this link: ${resetLink}`,
      html,
    });
  }
}