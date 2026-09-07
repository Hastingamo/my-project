import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { ForgotPassword } from './entities/forgotPassword.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ForgotPassword]),

  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}