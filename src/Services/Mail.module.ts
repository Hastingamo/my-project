import { Module } from '@nestjs/common';
import { MailService } from './mail.Services';
@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}