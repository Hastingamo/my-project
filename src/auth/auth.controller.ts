
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from 'src/guards/auth.guards';
import { PasswordChangeDto } from './dto/changePassword.dto';
import { ForgotPasswordDto } from './dto/forgetPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signUpData: SignupDto) {
    return this.authService.signup(signUpData);
  }

  @Post('login')
  async login(@Body() credentials: LoginDto) {
    return this.authService.login(credentials);
  }

  @UseGuards(AuthGuard)
  @Get('protected')
  someProtectedRoute(@Req() request: Request & { userId: number }) {
    return {
      message: 'Access granted',
      status: 200,
      data: 'This route is protected and requires authentication.',
      userId: request.userId,
    };
  }

  @UseGuards(AuthGuard)
  @Put('changePassword')
  async changePassword(
    @Body() changePasswordData: PasswordChangeDto,
    @Req() request: Request & { userId: number },
  ) {
    return this.authService.changePasswordData(
      changePasswordData.oldPassword,
      changePasswordData.newPassword,
      request.userId,
    );
  }

  @Post('forgetPassword')
  async forgetPassword(@Body() forgetPasswordData: ForgotPasswordDto) {
    return this.authService.forgetPassword(forgetPasswordData.email);
  }

@UseGuards(AuthGuard)
@Get('profile')
async getProfile(@Req() req) {
  return this.authService.findById(req.userId);
}

  @Post('resetPassword')
async resetPassword(@Body() resetPasswordData: ResetPasswordDto) {
  return this.authService.resetPassword(
    resetPasswordData.resetToken,
    resetPasswordData.newPassword,
  );
}
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}