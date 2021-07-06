import { IsNotEmpty } from 'class-validator'
import { TradeChannel } from 'src/common/enum/trade.enum'

export class LoginBody {
  @IsNotEmpty({ message: '用户名称不能为空' })
  username: string

  @IsNotEmpty({ message: '密码不能为空' })
  password: string
}

export class SoftwareDto {
  appid: string

  @IsNotEmpty({ message: '项目名称不可或缺' })
  name: string

  callback_url: string

  return_url: string
}

// 因为生成退款账单的时候sys_refund_no 用的就是 sys_trade_no 所以这里直接用了 sys_trade_no
export class FindTradeParamDto {
  sys_trade_no: string

  channel: TradeChannel
}

export class FindPayappParamDto {
  name: string

  channel: TradeChannel
}
