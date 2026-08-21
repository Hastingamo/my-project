import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
      userName: userName,
      role,
    });
//     const newUser = this.userRepository.create({
//   email,
//   password: hashedPassword,
//   userName: userName,
//   role,
// });

const savedUser = await this.userRepository.save(newUser);
const { password: _, ...safeUser } = savedUser;
    

    return {
      message: 'Signup successful',
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

    const { password: _, ...safeUser } = user;

    return {
      message: 'Login successful',
      user: safeUser,
    };
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