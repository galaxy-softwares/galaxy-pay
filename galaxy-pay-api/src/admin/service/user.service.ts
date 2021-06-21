import { Injectable } from '@nestjs/common'
import { BaseService } from './base.service'
import { User } from 'src/admin/entities'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
    super(userRepository)
  }

  find() {
    return this.userRepository.find()
  }
}
