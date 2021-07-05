import { IsNotEmpty } from 'class-validator'
import { TradeChannel } from 'src/common/enum/trade.enum'

export class PayappDto {
  id?: string

  @IsNotEmpty({ message: '支付应用名称不能为空' })
  name: string

  @IsNotEmpty({ message: '请选择归属项目' })
  software_id: number

  pay_app_id: string

  pay_secret_key: string

  @IsNotEmpty({ message: '请输入支付异步通知地址' })
  notify_url: string

  @IsNotEmpty({ message: '请输入支付回调地址' })
  callback_url: string

  return_url: string

  @IsNotEmpty({ message: '请输入授权请求地址' })
  domain_url: string

  @IsNotEmpty({ message: '请选择支付通道' })
  channel: TradeChannel

  config: string

  appid: string
  // 微信
  mch_id: string
  mch_key: string
  app_secret: string
  apiclient_cert: string
  // 支付宝
  certificate: string
  private_key: string
  public_key: string

  app_cert_sn: string
  alipay_root_cert_sn: string
}
