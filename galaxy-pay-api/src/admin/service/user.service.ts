import { Injectable } from '@nestjs/common';
import { BaseService } from './base.service';
import { User } from 'src/admin/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {
    super(userRepository);
  }
  getHello(): string {
    return 'Hello World!';
  }
}
