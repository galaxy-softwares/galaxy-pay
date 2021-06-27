import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { UserService } from './user.service'
import { JwtService } from '@nestjs/jwt'
import * as crypto from 'crypto-js'
// export function Test() {
//   return (target, _, descriptor: PropertyDescriptor) => {
//     const method = descriptor.value
//     let ret
//     descriptor.value = async function (...args) {
//       args[0] = { username: 'admin', password: '123456789' }
//       console.log(args, '-----------------------')
//       ret = method.apply(target, args)
//       return ret
//     }
//     return descriptor
//   }
// }

@Injectable()
export class AuthService {
  validateUser() {
    throw new Error('Method not implemented.')
  }

  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async login(data) {
    const { username, password } = data
    console.log(username, password, '被修改了！')
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
