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
import { TransformService } from '../service/transform.service';
import {
  AliAppPayService,
  AliPagePayService,
  AlipayConfig,
  AlipayPrecreateResponse,
  AlipayTradeCreateResponse,
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
    private readonly transformService: TransformService,
    @Inject(HttpService) protected readonly httpService: HttpService,
  ) {}

  /**
   * app支付
   * @param param
   * @param body
   */
  @Post('app')
  async appPay(@Body() body: AliPayDto, @PayConfig() payConfig: AlipayConfig) {
    await this.apiTradeService.generateOrder(body, payConfig);
    return this.aliAppPayService.pay(
      {
        product_code: 'QUICK_MSECURITY_PAY',
        subject: body.body,
        out_trade_no: body.out_trade_no,
        total_amount: body.money,
        ...body.biz_count,
      },
      payConfig,
    );
  }

  /**
   * pc 支付
   * @param body AliPayDto
   * @param payConfig AlipayConfig
   */
  @Post('page')
  async pagePay(@Body() body: AliPayDto, @PayConfig() payConfig: AlipayConfig): Promise<string> {
    await this.apiTradeService.generateOrder(body, payConfig);
    return this.aliPagePaySerice.pay(
      {
        product_code: 'FAST_INSTANT_TRADE_PAY',
        subject: body.body,
        out_trade_no: body.out_trade_no,
        total_amount: body.money,
        ...body.biz_count,
      },
      payConfig,
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
    @PayConfig() payConfig: AlipayConfig,
  ): Promise<AlipayPrecreateResponse> {
    await this.apiTradeService.generateOrder(body, payConfig);
    return await this.alitradePayService.precreate(
      {
        product_code: 'FACE_TO_FACE_PAYMENT',
        subject: body.body,
        out_trade_no: body.out_trade_no,
        total_amount: body.money,
        ...body.biz_count,
      },
      payConfig,
    );
  }

  /**
   * 支付宝手机支付
   * @param body AliPayDto
   * @param payConfig AlipayConfig
   */
  @Post('wap')
  async wap(@Body() body: AliPayDto, @PayConfig() payConfig: AlipayConfig): Promise<string> {
    await this.apiTradeService.generateOrder(body, payConfig);
    return this.aliwapPayService.pay(
      {
        product_code: 'FACE_TO_FACE_PAYMENT',
        subject: body.body,
        out_trade_no: body.out_trade_no,
        total_amount: body.money,
        ...body.biz_count,
      },
      payConfig,
    );
  }

  /**
   * 支付宝退款接口
   * @param param
   * @param body
   */
  @Post('refund')
  async refund(@Body() body: AliPayRefundDto, @PayConfig() payConfig: AlipayConfig): Promise<any> {
    await this.apiTradeService.generateRefundOrder(body, payConfig);
    const refund_result = await this.alitradePayService.refund(
      {
        trade_no: body.trade_no,
        refund_amount: body.money,
        refund_reason: body.body,
      },
      payConfig,
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
  async create(
    @Body() body: AliPayDto,
    @PayConfig() payConfig: AlipayConfig,
  ): Promise<AlipayTradeCreateResponse> {
    await this.apiTradeService.generateOrder(body, payConfig);
    return await this.alitradePayService.create(
      {
        product_code: 'FACE_TO_FACE_PAYMENT',
        subject: body.body,
        out_trade_no: body.out_trade_no,
        total_amount: body.money,
        ...body.biz_count,
      },
      payConfig,
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
