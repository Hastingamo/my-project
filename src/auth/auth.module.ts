import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { ForgotPassword } from './entities/forgotPassword.entity';
import { MailService } from 'src/Services/mail.Services';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ForgotPassword]),

  ],
  controllers: [AuthController],
  providers: [AuthService, MailService],
})
export class AuthModule {}