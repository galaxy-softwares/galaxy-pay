import { IsNotEmpty } from 'class-validator'

export class LoginBody {
  @IsNotEmpty({ message: '用户名称不能为空' })
  username: string

  @IsNotEmpty({ message: '密码不能为空' })
  password: string
}
