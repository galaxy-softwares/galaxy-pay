import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { BaseService } from './base.service'
import { InjectRepository } from '@nestjs/typeorm'
import { createQueryBuilder, Repository } from 'typeorm'
import { Payapp, Software } from '../entities'
import { AliCertUtil } from 'galaxy-pay-config'
import { joinPath, randomString, transformationCertificate } from 'src/common/utils/indedx'
import {
  PayappEntity,
  PayappData,
  AlipayConfig,
  AlipayPublicCert,
  AlipayPublic,
  WechatConfig
} from 'src/common/interfaces/common.interface'
import { PayappDto } from '../dtos/payapp.dto'
import { TradeChannel } from 'src/common/enum/trade.enum'

@Injectable()
export class PayappService extends BaseService<Payapp> {
  constructor(
    @InjectRepository(Payapp)
    private readonly payappRepository: Repository<Payapp>,
    private readonly aliCertUtil: AliCertUtil
  ) {
    super(payappRepository)
  }

  public isAliPayCert(alipay_config: AlipayConfig): AlipayPublicCert | AlipayPublic {
    try {
      const private_key = transformationCertificate(alipay_config.private_key)
      if (alipay_config.certificate == '20') {
        const alipay_sn = this.aliCertUtil.getCertPattern(
          joinPath(alipay_config.app_cert_sn),
          joinPath(alipay_config.alipay_root_cert_sn),
          joinPath(alipay_config.public_key)
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

  async findPayappConfig(pay_app_id: string): Promise<AlipayConfig | WechatConfig> {
    const payapp = await this.payappRepository.findOne({ pay_app_id })
    const config: AlipayConfig = JSON.parse(payapp.config)
    if (payapp.channel === TradeChannel.alipay) {
      const pay_config: AlipayConfig = {
        ...config,
        ...this.isAliPayCert(JSON.parse(payapp.config))
      }
      return pay_config
    } else {
      const pay_config: WechatConfig = {
        ...payapp,
        ...JSON.parse(payapp.config)
      }
      return pay_config
    }
  }

  /**
   * 生成项目参数
   * @param data PayappDto
   */

  private generatePayapp(data: PayappDto): PayappEntity {
    const payapp: PayappData = {
      name: data.name,
      notify_url: data.notify_url,
      domain_url: data.domain_url,
      software_id: data.software_id,
      callback_url: data.callback_url,
      return_url: data.return_url,
      channel: data.channel
    } as PayappData
    if (data.id) {
      payapp.id = +data.id
    } else {
      payapp.pay_app_id = randomString()
      payapp.pay_secret_key = randomString()
    }
    if (data.channel === TradeChannel.wechat) {
      payapp.config = {
        appid: data.appid,
        mch_id: data.mch_id,
        mch_key: data.mch_key,
        app_secret: data.app_secret,
        apiclient_cert: data.apiclient_cert
      }
    } else {
      payapp.config = {
        appid: data.appid,
        certificate: data.certificate,
        private_key: data.private_key,
        public_key: data.public_key,
        app_cert_sn: data.app_cert_sn,
        alipay_root_cert_sn: data.alipay_root_cert_sn
      }
    }
    return {
      ...payapp,
      config: JSON.stringify(payapp.config)
    }
  }

  async createPayapp(data: PayappDto): Promise<Payapp> {
    const payapp = this.payappRepository.create(this.generatePayapp(data))
    return await this.payappRepository.save(payapp)
  }

  async updatePayapp(data: PayappDto): Promise<Payapp> {
    const payapp = this.payappRepository.create(this.generatePayapp(data))
    return await this.payappRepository.save(payapp)
  }

  async findPayapp() {
    const user = await createQueryBuilder(Payapp, 'payapp')
      .leftJoinAndMapOne('payapp.software', Software, 'software', 'software.id = payapp.software_id')
      .getMany()
    return user
  }
}
