// import { Injectable, ConflictException, UnauthorizedException,Logger  } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import * as bcrypt from 'bcrypt';
// import { User } from './entities/user.entity';
// import { SignupDto } from './dto/signup.dto';
// import { LoginDto } from './dto/login.dto';
// import { JwtService } from '@nestjs/jwt';
// import { nanoid } from 'nanoid';
// import { ForgotPassword } from './entities/forgotPassword.entity';
// import { MailService } from 'src/Services/mail.Services';

// @Injectable()
// export class AuthService {
//     private readonly logger = new Logger(AuthService.name); 
//   constructor(
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//     @InjectRepository(ForgotPassword)
//     private forgotPasswordRepository: Repository<ForgotPassword>,
//     private jwtService: JwtService,
//     private mailService: MailService,
//   ) {}

//   async signup(signUpData: SignupDto) {
//     const { email, password, userName, role, adminKey } = signUpData;

//     if (role === 'admin') {
//       if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
//         throw new UnauthorizedException('Invalid admin key');
//       }
//     }
    

//     const emailExist = await this.userRepository.findOne({ where: { email } });
//     if (emailExist) {
//       throw new ConflictException('Email already exists');
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = this.userRepository.create({
//       email,
//       password: hashedPassword,
//       userName,
//       role,
//     });

//     const savedUser = await this.userRepository.save(newUser);
//     const tokens = await this.generateTokens(savedUser.id);
//     await this.updateRefreshToken(savedUser.id, tokens.refreshToken);

//     const { password: _, hashedRefreshToken: __, ...safeUser } = savedUser;

//     return {
//       message: 'Signup successful',
//       ...tokens,
//       user: safeUser,
//     };
//   }

//   async login(credentials: LoginDto) {
//     const { email, password } = credentials;

//     const user = await this.userRepository.findOne({ where: { email } });
//     if (!user) {
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch) {
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     const tokens = await this.generateTokens(user.id);
//     await this.updateRefreshToken(user.id, tokens.refreshToken);

//     const { password: _, hashedRefreshToken: __, ...safeUser } = user;

//     return {
//       message: 'Login successful',
//       ...tokens,
//       user: safeUser,
//     };
//   }

//   async generateTokens(userId: number) {
//     const [accessToken, refreshToken] = await Promise.all([
//       this.jwtService.signAsync(
//         { sub: userId },
//         { secret: process.env.JWT_SECRET, expiresIn: '15m' },
//       ),
//       this.jwtService.signAsync(
//         { sub: userId },
//         { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
//       ),
//     ]);

//     return { accessToken, refreshToken };
//   }

//   async updateRefreshToken(userId: number, refreshToken: string) {
//     const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
//     await this.userRepository.update(userId, { hashedRefreshToken });
//   }

//   async refreshTokens(userId: number, refreshToken: string) {
//     const user = await this.userRepository.findOne({ where: { id: userId } });

//     if (!user || !user.hashedRefreshToken) {
//       throw new UnauthorizedException('Access denied');
//     }

//     const refreshTokenMatches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
//     if (!refreshTokenMatches) {
//       throw new UnauthorizedException('Access denied');
//     }

//     const tokens = await this.generateTokens(user.id);
//     await this.updateRefreshToken(user.id, tokens.refreshToken);

//     return tokens;
//   }

//   async changePasswordData(oldPassword: string, newPassword: string, userId: number) {
//     const user = await this.userRepository.findOne({ where: { id: userId } });
//     if (!user) {
//       throw new UnauthorizedException('User not found');
//     }
//     const passwordMatch = await bcrypt.compare(oldPassword, user.password);
//     if (!passwordMatch) {
//       throw new UnauthorizedException('Old password is incorrect');
//     }
//     const hashedNewPassword = await bcrypt.hash(newPassword, 10);
//     await this.userRepository.update(userId, { password: hashedNewPassword });
//     return { message: 'Password changed successfully' };
//   }

//   async forgetPassword(email: string) {
//     const user = await this.userRepository.findOne({ where: { email } });

//     if (user) {
//       const expirationDate = new Date();
//       expirationDate.setHours(expirationDate.getHours() + 1); // expires in 1 hour

//       const resetToken = nanoid(64);

//       const forgotPasswordEntry = this.forgotPasswordRepository.create({
//         userId: user.id,
//         resetPasswordToken: resetToken,
//         resetPasswordExpires: expirationDate,
//       });
//       await this.forgotPasswordRepository.save(forgotPasswordEntry);

//       try {
//         await this.mailService.sendPasswordResetEmail(email, resetToken);
//       } catch (error) {
//   this.logger.error('Failed to send reset email', error); // add a Logger to AuthService if you don't have one
//       }
//     }

//     return {
//       message: 'If that email exists, a reset link has been sent',
//     };
//   }

// async resetPassword(resetToken: string, newPassword: string) {
//   const forgotPasswordEntry = await this.forgotPasswordRepository.findOne({
//     where: { resetPasswordToken: resetToken },
//   });

//   if (!forgotPasswordEntry) {
//     throw new UnauthorizedException('Invalid or expired reset token');
//   }

//   if (
//     !forgotPasswordEntry.resetPasswordExpires ||
//     new Date(forgotPasswordEntry.resetPasswordExpires) < new Date()
//   ) {
//     throw new UnauthorizedException('Invalid or expired reset token');
//   }

//   const user = await this.userRepository.findOne({
//     where: { id: forgotPasswordEntry.userId },
//   });

//   if (!user) {
//     throw new UnauthorizedException('Invalid or expired reset token');
//   }

//   const hashedPassword = await bcrypt.hash(newPassword, 10);
//   await this.userRepository.update(user.id, { password: hashedPassword });

//   // invalidate the token so it can't be reused
//   await this.forgotPasswordRepository.delete(forgotPasswordEntry.id);

//   return { message: 'Password has been reset successfully' };
// }

//   async logout(userId: number) {
//     await this.userRepository.update(userId, { hashedRefreshToken: null });
//     return { message: 'Logged out successfully' };
//   }

//   findAll() {
//     return `This action returns all auth`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} auth`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} auth`;
//   }
// }



import { Injectable, ConflictException, UnauthorizedException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { nanoid } from 'nanoid';
import { ForgotPassword } from './entities/forgotPassword.entity';
import { MailService } from 'src/Services/mail.Services';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ForgotPassword)
    private forgotPasswordRepository: Repository<ForgotPassword>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signup(signUpData: SignupDto) {
    const { email, password, userName, role, adminKey } = signUpData;

    if (role === 'admin') {
      if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
        throw new UnauthorizedException('Invalid admin key');
      }
    }

    const emailExist = await this.userRepository.findOne({ where: { email } });
    if (emailExist) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      userName,
      role,
    });

    const savedUser = await this.userRepository.save(newUser);
    const tokens = await this.generateTokens(savedUser.id);
    await this.updateRefreshToken(savedUser.id, tokens.refreshToken);

    const { password: _, hashedRefreshToken: __, ...safeUser } = savedUser;

    return {
      message: 'Signup successful',
      ...tokens,
      user: safeUser,
    };
  }

  async login(credentials: LoginDto) {
    const { email, password } = credentials;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    const { password: _, hashedRefreshToken: __, ...safeUser } = user;

    return {
      message: 'Login successful',
      ...tokens,
      user: safeUser,
    };
  }

  async generateTokens(userId: number) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId },
        { secret: process.env.JWT_SECRET, expiresIn: '15m' },
      ),
      this.jwtService.signAsync(
        { sub: userId },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, { hashedRefreshToken });
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access denied');
    }

    const tokens = await this.generateTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async changePasswordData(oldPassword: string, newPassword: string, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Old password is incorrect');
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(userId, { password: hashedNewPassword });
    return { message: 'Password changed successfully' };
  }

  async forgetPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 1);

      const resetToken = nanoid(64);

      const forgotPasswordEntry = this.forgotPasswordRepository.create({
        userId: user.id,
        resetPasswordToken: resetToken,
        resetPasswordExpires: expirationDate,
      });
      await this.forgotPasswordRepository.save(forgotPasswordEntry);

      try {
        await this.mailService.sendPasswordResetEmail(email, resetToken);
      } catch (error) {
        this.logger.error('Failed to send reset email', error);
      }
    }

    return {
      message: 'If that email exists, a reset link has been sent',
    };
  }

  async resetPassword(resetToken: string, newPassword: string) {
    const forgotPasswordEntry = await this.forgotPasswordRepository.findOne({
      where: { resetPasswordToken: resetToken },
    });

    if (!forgotPasswordEntry) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    if (
      !forgotPasswordEntry.resetPasswordExpires ||
      new Date(forgotPasswordEntry.resetPasswordExpires) < new Date()
    ) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const user = await this.userRepository.findOne({
      where: { id: forgotPasswordEntry.userId },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(user.id, { password: hashedPassword });

    await this.forgotPasswordRepository.delete(forgotPasswordEntry.id);

    return { message: 'Password has been reset successfully' };
  }

  async logout(userId: number) {
    await this.userRepository.update(userId, { hashedRefreshToken: null });
    return { message: 'Logged out successfully' };
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, hashedRefreshToken, ...safeUser } = user;
    return safeUser;
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}