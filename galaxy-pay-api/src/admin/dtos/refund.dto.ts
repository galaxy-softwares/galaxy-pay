import { IsNotEmpty } from 'class-validator';

export class WechatRefundPayDto {
  @IsNotEmpty({ message: 'appid不能为空' })
  appid: string;

  @IsNotEmpty({ message: '退款订单不能为空！' })
  sys_transaction_no: string;

  @IsNotEmpty({ message: '退款金额不能为空' })
  refund_money: string;

  @IsNotEmpty({ message: '付款金额不能为空！' })
  money: string;

  @IsNotEmpty({ message: '订单编号不能为空！' })
  sys_trade_no: string;

  @IsNotEmpty({ message: '订单标题不能为空！' })
  body: string;

  callback_url?: string;
}

export class AliPayRefundDto {
  @IsNotEmpty({ message: 'appid不能为空' })
  appid: string;

  @IsNotEmpty({ message: '退款编号不能为空！' })
  sys_transaction_no: string;

  @IsNotEmpty({ message: '退款交易号不能为空！' })
  sys_trade_no: string;

  @IsNotEmpty({ message: '交易总金额不能为空' })
  money: string;

  @IsNotEmpty({
    message: '退款金额不能为空',
  })
  refund_money: string;

  @IsNotEmpty({ message: '退款原因不能为空' })
  body: string;

  callback_url: string;
}
