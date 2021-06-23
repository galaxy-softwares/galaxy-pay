import { IsNotEmpty } from 'class-validator'
import { TradeChannel } from 'src/common/enum/trade.enum'

export class AlipayQuery {
  @IsNotEmpty({ message: 'appid不能为空' })
  appid: string

  @IsNotEmpty({ message: '订单编号不能为空！' })
  out_trade_no: string
}

export class AliPayDto {
  @IsNotEmpty({ message: 'appid不能为空' })
  appid: string

  @IsNotEmpty({ message: '付款金额不能为空！' })
  money: string

  @IsNotEmpty({ message: '订单编号不能为空！' })
  sys_trade_no: string

  @IsNotEmpty({ message: '订单标题不能为空！' })
  body: string

  /**
   * 请求参数的集合
   * 请参考 https://opendocs.alipay.com/apis/api_1/alipay.trade.pay
   */
  biz_count?: Object
  /**
   * 销售产品码
   */
  product_code?: string
}

export class WechatPayQuery {
  @IsNotEmpty({ message: 'appid不能为空' })
  appid: string

  @IsNotEmpty({ message: '订单编号不能为空！' })
  sys_trade_no: string
}

export class WechatPayDto {
  @IsNotEmpty({ message: 'appid不能为空' })
  appid: string

  @IsNotEmpty({ message: '付款金额不能为空！' })
  money: string

  @IsNotEmpty({ message: '订单编号不能为空！' })
  sys_trade_no: string

  @IsNotEmpty({ message: '订单标题不能为空！' })
  body: string

  callback_url?: string

  return_url?: string

  notify_url?: string
}

export class PayappDto {
  @IsNotEmpty({ message: '支付应用名称不能为空' })
  name: string

  @IsNotEmpty({ message: '请选择归属项目' })
  software_id: number

  pay_app_type: string

  callback_url: string

  domain_url: string

  @IsNotEmpty({ message: '请选择支付通道' })
  channel: TradeChannel
}
