import { Controller, Post, Body, UseGuards, Inject, HttpService, HttpException, HttpStatus } from '@nestjs/common'
import { PayConfig } from 'src/common/decorator/pay.config.decorator'
import { PayGuard } from 'src/common/guard/pay.guard'
import { AliPayDto, AlipayQuery } from 'src/admin/dtos/pay.dto'
import { AliPayRefundDto } from 'src/admin/dtos/refund.dto'
import { ApiTradeSerivce } from '../service/api.trade.service'
import {
  AliAppPayService,
  AliCertUtil,
  AliPagePayService,
  AlipayConfig,
  AlipayTradeCloseRes,
  AlipayTradeCreateRes,
  AlipayTradePrecreateRes,
  AlipayTradeQueryRefundRes,
  AlipayTradeQueryRes,
  AliTradePayService,
  AliWapPayService
} from 'galaxy-pay-config'
import { TradeChannel } from 'src/common/enum/trade.enum'

@Controller('alipay')
@UseGuards(PayGuard)
export class AlipayController {
  constructor(
    private readonly aliPagePaySerice: AliPagePayService,
    private readonly aliAppPayService: AliAppPayService,
    private readonly aliTradePayService: AliTradePayService,
    private readonly aliWapPayService: AliWapPayService,
    private readonly apiTradeService: ApiTradeSerivce,
    private aliCertUtil: AliCertUtil,
    @Inject(HttpService) protected readonly httpService: HttpService
  ) {}

  /**
   * 判断是否是证书模式
   * @param alipay_config
   */
  public isAliPayCert(alipay_config: AlipayConfig): AlipayConfig {
    try {
      if (alipay_config.app_cert_sn) {
        const { app_cert_sn, alipay_root_cert_sn, public_key } = this.aliCertUtil.getCertPattern(
          alipay_config.app_cert_sn,
          alipay_config.alipay_root_cert_sn,
          alipay_config.alipay_cert_public_key
        )
        return { ...alipay_config, public_key, alipay_root_cert_sn, app_cert_sn }
      } else {
        return alipay_config
      }
    } catch (e) {
      throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * app支付
   * @param param
   * @param body
   */
  @Post('app')
  async appPay(@Body() body: AliPayDto, @PayConfig() alipay_config: AlipayConfig) {
    await this.apiTradeService.generateOrder(body, alipay_config)
    return this.aliAppPayService.pay(
      {
        product_code: 'QUICK_MSECURITY_PAY',
        subject: body.body,
        out_trade_no: body.sys_trade_no,
        total_amount: body.money,
        ...body.biz_count
      },
      this.isAliPayCert(alipay_config)
    )
  }

  /**
   * pc 支付
   * @param body AliPayDto
   * @param payConfig AlipayConfig
   */
  @Post('page')
  async pagePay(@Body() body: AliPayDto, @PayConfig() alipay_config: AlipayConfig): Promise<string> {
    await this.apiTradeService.generateOrder(body, alipay_config)
    return this.aliPagePaySerice.pay(
      {
        product_code: 'FAST_INSTANT_TRADE_PAY',
        subject: body.body,
        out_trade_no: body.sys_trade_no,
        total_amount: body.money,
        ...body.biz_count
      },
      this.isAliPayCert(alipay_config)
    )
  }

  /**
   * 支付宝 交易查询
   * @param param AlipayQuery
   * @param alipay_config AlipayConfig
   */
  @Post('query')
  async query(@Body() body: AlipayQuery, @PayConfig() alipay_config: AlipayConfig): Promise<AlipayTradeQueryRes> {
    return await this.aliTradePayService.query(
      {
        out_trade_no: body.out_trade_no
      },
      this.isAliPayCert(alipay_config)
    )
  }

  /**
   * 支付宝 退款查询
   * @param body AlipayQuery
   * @param alipay_config
   */
  @Post('refundQuery')
  async refundQuery(
    @Body() body: AlipayQuery,
    @PayConfig() alipay_config: AlipayConfig
  ): Promise<AlipayTradeQueryRefundRes> {
    return await this.aliTradePayService.fastpayRefundQuery(
      {
        out_trade_no: body.out_trade_no,
        out_request_no: body.out_trade_no
      },
      this.isAliPayCert(alipay_config)
    )
  }

  /**
   * 支付宝扫码接口
   * @param body AliPayDto
   * @param payConfig AlipayConfig
   */
  @Post('precreate')
  async precreate(@Body() body: AliPayDto, @PayConfig() alipay_config: AlipayConfig): Promise<AlipayTradePrecreateRes> {
    await this.apiTradeService.generateOrder(body, alipay_config)
    return await this.aliTradePayService.precreate(
      {
        product_code: 'FACE_TO_FACE_PAYMENT',
        subject: body.body,
        out_trade_no: body.sys_trade_no,
        total_amount: body.money,
        ...body.biz_count
      },
      this.isAliPayCert(alipay_config)
    )
  }

  /**
   * 支付宝手机支付
   * @param body AliPayDto
   * @param payConfig AlipayConfig
   */
  @Post('wap')
  async wap(@Body() body: AliPayDto, @PayConfig() alipay_config: AlipayConfig): Promise<string> {
    await this.apiTradeService.generateOrder(body, alipay_config)
    return this.aliWapPayService.pay(
      {
        product_code: 'FACE_TO_FACE_PAYMENT',
        subject: body.body,
        out_trade_no: body.sys_trade_no,
        total_amount: body.money,
        ...body.biz_count
      },
      this.isAliPayCert(alipay_config)
    )
  }

  /**
   * 支付宝退款接口
   * @param param
   * @param body
   */
  @Post('refund')
  async refund(@Body() body: AliPayRefundDto, @PayConfig() alipay_config: AlipayConfig): Promise<string> {
    await this.apiTradeService.generateRefundOrder(body, alipay_config, TradeChannel.alipay)
    const refund_result = await this.aliTradePayService.refund(
      {
        trade_no: body.sys_transaction_no,
        out_request_no: body.sys_trade_no,
        refund_amount: body.money,
        refund_reason: body.body
      },
      this.isAliPayCert(alipay_config)
    )
    if (refund_result.code == '10000') {
      if (await this.apiTradeService.refundSuccess(body.sys_trade_no, TradeChannel.alipay, refund_result.trade_no)) {
        return '退款成功！'
      } else {
        return '退款失败！'
      }
    } else {
      throw new HttpException(refund_result.sub_msg, HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 支付宝订单创建接口
   * @param param
   * @param body
   */
  @Post('create')
  async create(@Body() body: AliPayDto, @PayConfig() alipay_config: AlipayConfig): Promise<AlipayTradeCreateRes> {
    await this.apiTradeService.generateOrder(body, alipay_config)
    return await this.aliTradePayService.create(
      {
        product_code: 'FACE_TO_FACE_PAYMENT',
        subject: body.body,
        out_trade_no: body.sys_trade_no,
        total_amount: body.money,
        ...body.biz_count
      },
      this.isAliPayCert(alipay_config)
    )
  }

  // @Post('transfer')
  // async transfer(@Body() body, @PayConfig() payConfig: AlipayConfig): Promise<any> {
  //   /**
  //    * 创建提现订单。
  //    */
  //   await this.apiTradeService.generateOrder(body, payConfig);
  //   const param = this.transformService.transformAlipayParams<AlipayTransferBizContent>(
  //     {
  //       out_biz_no: '2020091122001465530515423423',
  //       trans_amount: '0.01',
  //       product_code: 'TRANS_ACCOUNT_NO_PWD',
  //       biz_scene: 'DIRECT_TRANSFER',
  //       order_title: '转账订单测试',
  //       payee_info: {
  //         identity: '',
  //         identity_type: '',
  //         name: '',
  //       },
  //       remark: '单笔转账',
  //       business_params: '',
  //     },
  //     payConfig,
  //     'alipay.fund.trans.uni.transfer',
  //   );
  //   return await this.fundPayService.transfer(param, payConfig.private_key, payConfig.public_key);
  // }

  /**
   * 支付宝 交易关闭接口
   * @param param
   * @param body
   */
  @Post('close')
  async close(@Body() body: AlipayQuery, @PayConfig() alipay_config: AlipayConfig): Promise<AlipayTradeCloseRes> {
    return await this.aliTradePayService.close(
      {
        out_trade_no: body.out_trade_no
      },
      this.isAliPayCert(alipay_config)
    )
  }
}
