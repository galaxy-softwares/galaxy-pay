import { IsNotEmpty } from 'class-validator'

export class WechatRefundPayDto {
  @IsNotEmpty({ message: 'pay_app_id不能为空' })
  pay_app_id: string

  @IsNotEmpty({ message: '退款订单不能为空！' })
  sys_trade_no: string

  @IsNotEmpty({ message: '退款金额不能为空！' })
  money: string

  @IsNotEmpty({ message: '订单标题不能为空！' })
  body: string

  callback_url: string
}

export class AliPayRefundDto {
  @IsNotEmpty({ message: 'pay_app_id不能为空' })
  pay_app_id: string

  @IsNotEmpty({ message: '支付宝订单编号不能为空' })
  sys_trade_no: string

  @IsNotEmpty({ message: '退款金额不能为空' })
  money: string

  @IsNotEmpty({ message: '退款原因不能为空' })
  body: string

  callback_url: string
}
