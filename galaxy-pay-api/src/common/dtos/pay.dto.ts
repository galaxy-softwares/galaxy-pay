import { IsNotEmpty } from 'class-validator';

export class PayDto {

  @IsNotEmpty({ message: 'appid不能为空' })
  appid: string;
  
  callback_url: string;

  return_url: string;

  @IsNotEmpty({ message: '异步回调地址不能为空' })
  notify_url: string;
}
