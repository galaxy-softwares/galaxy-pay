import { IsNotEmpty } from 'class-validator';
import { OrderChannel } from '../entities/order.entity';

export class AliPayDto {

  @IsNotEmpty({ message: 'appid不能为空' })
  appid: string;

  @IsNotEmpty({ message: '付款金额不能为空！' })
  money: string;

  @IsNotEmpty({ message: '订单编号不能为空！'})
  out_trade_no: string;

  @IsNotEmpty({ message: '订单标题不能为空！'})
  body: string;
  
  /**
   * 请求参数的集合
   * 请参考 https://opendocs.alipay.com/apis/api_1/alipay.trade.pay
   */
  biz_count?: Object;
  /**
   * 销售产品码
   */
  product_code?: string;

  channel: OrderChannel.alipay;
}

export class AliPayRefundDto extends AliPayDto {

  @IsNotEmpty({ message: '退款订单不能为空！' })
  trade_no: string;

  @IsNotEmpty({ message: '退款金额不能为空'})
  refund_money: string;

  @IsNotEmpty({ message: '退款愿意不能为空'})
  refund_reason?: string;
}


export class WechatPayDto {
  @IsNotEmpty({ message: 'appid不能为空' })
  appid: string;

  @IsNotEmpty({ message: '付款金额不能为空！' })
  money: number;

  @IsNotEmpty({ message: '订单编号不能为空！'})
  out_trade_no: string;

  @IsNotEmpty({ message: '订单标题不能为空！'})
  body: string;
  
  callback_url?: string;
  return_url?: string;
  notify_url?: string;

  channel: OrderChannel.wechat;
}


export class WechatRefundPayDto extends WechatPayDto {

  @IsNotEmpty({ message: '退款订单不能为空！' })
  trade_no: string;

  @IsNotEmpty({ message: '退款金额不能为空'})
  refund_money: number;

  @IsNotEmpty({ message: '退款原因不能为空！'})
  refund_reason: string;
  
  refund_notify_url?: string;
}