import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { AliCertUtil, AlipayConfig, AlipayPublic, AlipayPublicCert, WechatConfig } from 'galaxy-pay-config'
import { PayappService } from 'src/admin/service/payapp.service'
import { TradeChannel } from 'src/common/enum/trade.enum'
import { PayAlipayConfig, PayAppConfig, PayWechatConfig } from 'src/common/interfaces/common.interface'
import { joinPath, transformationCertificate } from 'src/common/utils/indedx'

@Injectable()
export class ApiPayappSerivce {
  constructor(private readonly payappService: PayappService, private readonly aliCertUtil: AliCertUtil) {}

  /**
   * 判断是否是支付宝证书模式
   * @param alipay_config
   * @returns
   */
  public isAliPayCert(alipay_config: AlipayConfig): AlipayPublicCert | AlipayPublic {
    try {
      const private_key = transformationCertificate(alipay_config.private_key)
      if (alipay_config.certificate == '20') {
        const alipay_sn = this.aliCertUtil.getCertPattern(
          joinPath(alipay_config.app_cert_sn),
          joinPath(alipay_config.public_key),
          joinPath(alipay_config.alipay_root_cert_sn)
        )
        const public_key = transformationCertificate(alipay_sn.public_key, 'public')
        return {
          private_key,
          public_key,
          app_cert_sn: alipay_sn.app_cert_sn,
          alipay_root_cert_sn: alipay_sn.alipay_root_cert_sn
        }
      }
      const public_key = transformationCertificate(alipay_config.public_key, 'public')
      return { private_key, public_key }
    } catch (e) {
      throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 根据pay_app_id 查询支付配置
   * @param pay_app_id
   * @returns
   */
  async findPayappConfig(
    pay_app_id: string
  ): Promise<{
    pay_secret_key: string
    domain_url: string
    callback_url: string
    config: PayAppConfig
  }> {
    const payapp = await this.payappService.findOneByPayappId(pay_app_id)
    return {
      pay_secret_key: payapp.pay_secret_key,
      domain_url: payapp.domain_url,
      callback_url: payapp.callback_url,
      config:
        payapp.channel === TradeChannel.alipay
          ? this.parseAlipayConfig(payapp.config, payapp.notify_url, payapp.return_url)
          : this.parseWechatConfig(payapp.config, payapp.notify_url, payapp.return_url)
    }
  }

  /**
   * 查找支付宝支付配置
   * @param payapp
   * @returns
   */
  async findPayappByAlipay(pay_app_id: string): Promise<PayAlipayConfig> {
    const payapp = await this.payappService.findOneByPayappId(pay_app_id)
    return {
      pay_secret_key: payapp.pay_secret_key,
      domain_url: payapp.domain_url,
      callback_url: payapp.callback_url,
      config: this.parseAlipayConfig(payapp.config, payapp.notify_url, payapp.return_url)
    }
  }

  /**
   * 查找微信支付配置
   * @param payapp
   * @returns
   */
  async findPayappByWechat(pay_app_id: string): Promise<PayWechatConfig> {
    const payapp = await this.payappService.findOneByPayappId(pay_app_id)
    return {
      pay_secret_key: payapp.pay_secret_key,
      domain_url: payapp.domain_url,
      callback_url: payapp.callback_url,
      config: this.parseWechatConfig(payapp.config, payapp.notify_url, payapp.return_url)
    }
  }

  /**
   * 转换微信支付参数
   * @param config
   * @returns
   */
  parseWechatConfig(config: string, notify_url: string, return_url: string): WechatConfig {
    const wechat: WechatConfig = JSON.parse(config)
    return {
      notify_url,
      return_url,
      ...wechat,
      apiclient_cert: joinPath(wechat.apiclient_cert)
    }
  }
  /**
   * 转换支付宝参数
   * @param config
   * @param notify_url
   * @param return_url
   * @returns
   */
  parseAlipayConfig(config: string, notify_url: string, return_url: string): AlipayConfig {
    const alipay: AlipayConfig = JSON.parse(config)
    return {
      notify_url,
      return_url,
      ...alipay,
      ...this.isAliPayCert(alipay)
    }
  }
}
