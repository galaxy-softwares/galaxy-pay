import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { UserService } from './user.service'
import { JwtService } from '@nestjs/jwt'
import * as crypto from 'crypto-js'

@Injectable()
export class AuthService {
  validateUser() {
    throw new Error('Method not implemented.')
  }

  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async login(data) {
    const { username, password } = data
    const user = await this.userService.findUserByWhere({ username: username })

    if (!user) {
      throw new HttpException('用户名不存在！', HttpStatus.BAD_REQUEST)
    }

    if (user.password != crypto.MD5(password).toString()) {
      throw new HttpException('密码错误！', HttpStatus.BAD_REQUEST)
    }

    const { id } = user
    const payload = { id, username }
    const token = this.signToken(payload)
    return {
      token
    }
  }

  signToken(data) {
    return this.jwtService.sign(data)
  }
}
