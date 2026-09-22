
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
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from 'src/guards/auth.guards';
import { PasswordChangeDto } from './dto/changePassword.dto';
import { ForgotPasswordDto } from './dto/forgetPassword.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import {AuthGuard as PassportAuthGuard} from '@nestjs/passport';
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

  @Get('google')
  @UseGuards(PassportAuthGuard('google'))
  async googleAuth() {
  }
  // @Get('google/callback')
  // @UseGuards(PassportAuthGuard('google'))
  // async googleAuthCallback(@Req() req, @Res() res: Response) {
  //   const { accessToken } = await this.authService.googleLogin(req.user);
  //   res.redirect(`http://localhost:3000/auth/callback?token=${accessToken}`);
  // }

  @Get('google/callback')
@UseGuards(PassportAuthGuard('google'))
async googleAuthCallback(@Req() req, @Res() res: Response) {
  const { accessToken, refreshToken } = await this.authService.googleLogin(req.user);
  res.redirect(`http://localhost:3000/auth/callback?token=${accessToken}&refreshToken=${refreshToken}`);
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
