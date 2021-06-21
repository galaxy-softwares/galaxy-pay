import { IsNotEmpty } from 'class-validator'
export class SoftwareDto {
  appid: string

  @IsNotEmpty({ message: '项目名称不可或缺' })
  name: string

  callback_url: string

  return_url: string
}
