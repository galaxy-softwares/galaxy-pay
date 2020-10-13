import { IsNotEmpty } from 'class-validator';
import { TradeChannel } from 'src/common/enum/trade.enum';

export class SoftwareDto {
  
  id?: number;

  appid: string;

  @IsNotEmpty({ message: '项目名称不可或缺' })
  name: string;

  call_back: string;

  notify_url: string;

  channel: TradeChannel;

  secret_key: string;
  
  @IsNotEmpty({ message: '请求地址不能为空' })
  domain_url: string;

  wechat_appid: string;

  wechat_debug: boolean;

  wechat_mch_id: string;

  wechat_mch_key: string;

  wechat_app_secret: string;

  wechat_notify_url: string;
  
  alipay_appid: string;

  alipay_private_key: string;

  alipay_public_key: string;

  alipay_notify_url: string;

}

export class QuerySoftwareDto {
  page: number;
  limit: number;
}