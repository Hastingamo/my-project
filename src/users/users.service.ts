// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class UsersService {}
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [{ id: 1, name: 'Moses', age: 1 }];

  findAll() {
    return this.users;
  }

  create(name: string, age: number) {
    const user = { id: this.users.length + 1, name, age };
    this.users.push(user);
    return user;
  }
}