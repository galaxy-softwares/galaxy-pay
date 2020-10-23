import {
  Controller,
  Post,
  Body,
  UseGuards,
  Inject,
  HttpService,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PayConfig } from 'src/common/decorator/pay.config.decorator';
import { PayGuard } from 'src/common/guard/pay.guard';
import { TradeChannel } from 'src/common/enum/trade.enum';
import { AliPayDto } from 'src/admin/dtos/pay.dto';
import { AliPayRefundDto } from 'src/admin/dtos/refund.dto';
import { ApiTradeSerivce } from '../service/api.trade.service';
import {
  AliAppPayService,
  AliCertUtil,
  AliPagePayService,
  AlipayConfig,
  AlipayPrecreateRes,
  AliTradePayService,
  AliWapPayService,
} from 'galaxy-pay-config';

@Controller('alipay')
@UseGuards(PayGuard)
export class AlipayController {
  constructor(
    private readonly aliPagePaySerice: AliPagePayService,
    private readonly aliAppPayService: AliAppPayService,
    private readonly alitradePayService: AliTradePayService,
    private readonly aliwapPayService: AliWapPayService,
    private readonly apiTradeService: ApiTradeSerivce,
    private aliCertUtil: AliCertUtil,
    @Inject(HttpService) protected readonly httpService: HttpService,
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
          alipay_config.alipay_cert_public_key,
        );
        return { ...alipay_config, public_key, alipay_root_cert_sn, app_cert_sn };
      }
    } catch (e) {
      throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * app支付
   * @param param
   * @param body
   */
  @Post('app')
  async appPay(@Body() body: AliPayDto, @PayConfig() alipay_config: AlipayConfig) {
    await this.apiTradeService.generateOrder(body, alipay_config);
    return this.aliAppPayService.pay(
      {
        product_code: 'QUICK_MSECURITY_PAY',
        subject: body.body,
        out_trade_no: body.out_trade_no,
        total_amount: body.money,
        ...body.biz_count,
      },
      this.isAliPayCert(alipay_config),
    );
  }

  /**
   * pc 支付
   * @param body AliPayDto
   * @param payConfig AlipayConfig
   */
  @Post('page')
  async pagePay(
    @Body() body: AliPayDto,
    @PayConfig() alipay_config: AlipayConfig,
  ): Promise<string> {
    await this.apiTradeService.generateOrder(body, alipay_config);
    return this.aliPagePaySerice.pay(
      {
        product_code: 'FAST_INSTANT_TRADE_PAY',
        subject: body.body,
        out_trade_no: body.out_trade_no,
        total_amount: body.money,
        ...body.biz_count,
      },
      this.isAliPayCert(alipay_config),
    );
  }

  /**
   * 查询订单
   * @param param
   * @param body
   */
  // @Post("query")
  // async tradePay(@Query() param: AliPayDto, @Body() body): Promise<AlipayTradeQueryResponse> {
  //     const alipayConfig = await this.apiAlipayService.generateAliPay(param, body);
  //     const result = await this.alitradePayService.query(body, alipayConfig);
  //     return result
  // }

  /**
   * 支付宝扫码接口
   * @param body AliPayDto
   * @param payConfig AlipayConfig
   */
  @Post('precreate')
  async precreate(
    @Body() body: AliPayDto,
    @PayConfig() alipay_config: AlipayConfig,
  ): Promise<AlipayPrecreateRes> {
    await this.apiTradeService.generateOrder(body, alipay_config);
    return await this.alitradePayService.precreate(
      {
        product_code: 'FACE_TO_FACE_PAYMENT',
        subject: body.body,
        out_trade_no: body.out_trade_no,
        total_amount: body.money,
        ...body.biz_count,
      },
      this.isAliPayCert(alipay_config),
    );
  }

  /**
   * 支付宝手机支付
   * @param body AliPayDto
   * @param payConfig AlipayConfig
   */
  @Post('wap')
  async wap(@Body() body: AliPayDto, @PayConfig() alipay_config: AlipayConfig): Promise<string> {
    await this.apiTradeService.generateOrder(body, alipay_config);
    return this.aliwapPayService.pay(
      {
        product_code: 'FACE_TO_FACE_PAYMENT',
        subject: body.body,
        out_trade_no: body.out_trade_no,
        total_amount: body.money,
        ...body.biz_count,
      },
      this.isAliPayCert(alipay_config),
    );
  }

  /**
   * 支付宝退款接口
   * @param param
   * @param body
   */
  @Post('refund')
  async refund(
    @Body() body: AliPayRefundDto,
    @PayConfig() alipay_config: AlipayConfig,
  ): Promise<string> {
    await this.apiTradeService.generateRefundOrder(body, alipay_config);
    const refund_result = await this.alitradePayService.refund(
      {
        trade_no: body.trade_no,
        refund_amount: body.money,
        refund_reason: body.body,
      },
      this.isAliPayCert(alipay_config),
    );
    if (refund_result.code == '10000') {
      if (
        await this.apiTradeService.refundSuccess(
          body.out_trade_no,
          body.trade_no,
          TradeChannel.alipay,
        )
      ) {
        return '退款成功！';
      } else {
        return '退款失败！';
      }
    } else {
      throw new HttpException(refund_result.sub_msg, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 支付宝订单创建接口
   * @param param
   * @param body
   */
  @Post('create')
  async create(@Body() body: AliPayDto, @PayConfig() alipay_config: AlipayConfig): Promise<any> {
    await this.apiTradeService.generateOrder(body, alipay_config);
    return await this.alitradePayService.create(
      {
        product_code: 'FACE_TO_FACE_PAYMENT',
        subject: body.body,
        out_trade_no: body.out_trade_no,
        total_amount: body.money,
        ...body.biz_count,
      },
      this.isAliPayCert(alipay_config),
    );
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
   * 支付宝订单关闭接口
   * @param param
   * @param body
   */
  // @Post("close")
  // async close(@Body() body: AliPayDto,  @PayConfig() payConfig: AlipayConfig): Promise<AlipayTradeCloseResponse> {
  //     const alipayConfig = await this.apiAlipayService.generateAliPay(param, body);
  //     const result = this.alitradePayService.close(body, alipayConfig);
  //     return result
  // }
}
