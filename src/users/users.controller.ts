// import { Controller } from '@nestjs/common';

// @Controller('users')
// export class UsersController {}
import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body('name') name: string, @Body('age') age: number) {
    return this.usersService.create(name, age);
  }
}