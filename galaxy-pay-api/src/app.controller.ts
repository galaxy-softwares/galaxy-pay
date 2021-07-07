import {
  Controller,
  Get,
  Post,
  Request,
  Res,
  Inject,
  Req,
  HttpService,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { AliSignUtil, WeChatNotifyParserUtil, WeChatPayNotifyRes, WeChatSignUtil } from 'galaxy-pay-config'
import { TradeService } from './admin/service'
import { ApiPayappSerivce } from './api/service/api.payapp.service'
import { TradeChannel } from './common/enum/trade.enum'
import { LoggerService } from './common/service/logger.service'
import { makeSignStr } from './common/utils/indedx'

@Controller()
export class AppController {
  constructor(
    private readonly apiPayappService: ApiPayappSerivce,
    private readonly aliSignUtil: AliSignUtil,
    private readonly tradeService: TradeService,
    @Inject(WeChatSignUtil) protected readonly signUtil: WeChatSignUtil,
    @Inject(HttpService) protected readonly httpService: HttpService,
    @Inject(WeChatNotifyParserUtil) private readonly weChatNotifyParserUtil: WeChatNotifyParserUtil,
    private loggerService: LoggerService
  ) {}

  @Get()
  async getHello() {
    return '我那个晓得！'
  }

  @Post('alipay_notify_url')
  async alipay_notify_url(@Request() req) {
    try {
      const data = req.body
      this.loggerService.info(`支付宝异步通知:${JSON.stringify(data)}`)
      const trade = await this.tradeService.findOrder(data.out_trade_no)
      const { pay_secret_key, config } = await this.apiPayappService.findPayappByAlipay(trade.pay_app_id)
      delete data.pay_app_type
      const sign_result = this.aliSignUtil.responSignVerify(data, config.public_key)
      if (sign_result) {
        const status = await this.tradeService.editPayStatus(data.out_trade_no, TradeChannel.alipay, data.trade_no)
        if (status) {
          const callback_result = await this.callbackRequest(trade.callback_url, data, pay_secret_key)
        }
      } else {
        throw new HttpException('支付签名校验不通过！', HttpStatus.BAD_REQUEST)
      }
    } catch (e) {
      throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST)
    }
  }

  @Post('wechat_notify_url')
  async wechat_notify_url(@Req() req, @Res() res) {
    res.set('Content-Type', 'text/html')
    res.status(200)
    try {
      const wechat_notify_res = await this.weChatNotifyParserUtil.receiveReqData<WeChatPayNotifyRes>(req, 'pay')
      this.loggerService.info(`微信异步通知:${JSON.stringify(wechat_notify_res)}`)
      const trade = await this.tradeService.findOrder(wechat_notify_res.out_trade_no)
      // 因为已经在支付查询的时候已经做了错误抛出所以不用再去判断是否存在账单。
      if (trade.trade_status == '1') {
        res.end(this.weChatNotifyParserUtil.generateSuccessMessage())
      }
      const { pay_secret_key, config } = await this.apiPayappService.findPayappByWechat(trade.pay_app_id)
      // 先拿到微信得签名
      const wechat_notify_res_sign = wechat_notify_res.sign
      // 不进行签名验证
      delete wechat_notify_res.sign
      const sign = this.signUtil.sign(wechat_notify_res, config.mch_key)
      //  还要判断是支付类型！！！！！！！
      if (
        sign !== wechat_notify_res_sign ||
        wechat_notify_res.return_code !== 'SUCCESS' ||
        wechat_notify_res.result_code !== 'SUCCESS'
      ) {
        res.end(this.weChatNotifyParserUtil.generateFailMessage('签名验证失败'))
      }
      const status = await this.tradeService.editPayStatus(
        wechat_notify_res.out_trade_no,
        TradeChannel.wechat,
        wechat_notify_res.transaction_id
      )
      if (status) {
        const callback_result = await this.callbackRequest(
          trade.callback_url,
          {
            out_trade_no: wechat_notify_res.out_trade_no,
            trade_no: wechat_notify_res.transaction_id
          },
          pay_secret_key
        )
        this.loggerService.info(`微信异步通知:${JSON.stringify(callback_result)}`)
        res.end(this.weChatNotifyParserUtil.generateSuccessMessage())
      }
    } catch (e) {
      res.end(this.weChatNotifyParserUtil.generateFailMessage(e.toString()))
    }
  }

  /**
   * 发送回调通知
   * @param callback_url
   * @param data
   * @param app_secret
   */
  private async callbackRequest(
    callback_url: string,
    data: {
      out_trade_no: string
      trade_no: string
    },
    app_secret: string
  ) {
    const callback_param = {
      out_trade_no: data.out_trade_no,
      trade_no: data.trade_no,
      sign: makeSignStr(
        {
          out_trade_no: data.out_trade_no,
          trade_no: data.trade_no
        },
        app_secret
      )
    }
    return await this.httpService
      .request({
        url: callback_url,
        params: callback_param,
        method: 'get'
      })
      .toPromise()
  }
}
