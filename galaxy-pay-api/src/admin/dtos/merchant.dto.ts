import { IsNotEmpty } from 'class-validator'
import { TradeChannel } from 'src/common/enum/trade.enum'

export class MerchantDto {
  id?: number

  appid: string

  @IsNotEmpty({ message: '项目名称不可或缺' })
  name: string

  secret_key: string

  channel: TradeChannel
}
