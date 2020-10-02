import { IsNotEmpty } from 'class-validator';

export class SoftwareDto {
  
  id?: number;

  appid: string;

  @IsNotEmpty({ message: '项目名称不可或缺' })
  name: string;

  call_back: string;

  notify_url: string;
  
  @IsNotEmpty({ message: '请求地址不能为空' })
  domain_url: string;

  @IsNotEmpty({ message: '微信appid不能为空' })
  wechat_appid: string;

  wechat_debug: boolean;

  @IsNotEmpty({ message: '微信商户号不能为空' })
  wechat_mch_id: string;

  @IsNotEmpty({ message: '微信商户密钥不能为空' })
  wechat_mch_key: string;

  @IsNotEmpty({ message: '微信开发者密钥不能为空' })
  wechat_app_secret: string;

  @IsNotEmpty({ message: '微信回调地址不能为空' })
  wechat_notify_url: string;
  
  @IsNotEmpty({ message: '支付宝appid不能为空' })
  alipay_appid: string;

  alipay_debug: boolean;

  alipay_private_key: string;

  alipay_public_key: string;

  alipay_notify_url: string;

}

export class QuerySoftwareDto {
  page: number;
  limit: number;
}