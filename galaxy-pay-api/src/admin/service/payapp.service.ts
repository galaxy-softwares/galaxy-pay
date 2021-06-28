import { Injectable } from '@nestjs/common'
import { BaseService } from './base.service'
import { Software } from 'src/admin/entities/software.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { createQueryBuilder, Repository } from 'typeorm'
import { Payapp } from '../entities'
import { PayappDto } from '../dtos/pay.dto'

@Injectable()
export class PayappService extends BaseService<Payapp> {
  constructor(
    @InjectRepository(Payapp)
    private readonly payappRepository: Repository<Payapp>
  ) {
    super(payappRepository)
  }

  async findPayappConfig(pay_app_id: string) {
    const payapp: any = await this.payappRepository.findOne({ pay_app_id })
    payapp.config = JSON.parse(payapp.config)
    return {
      callback_url: payapp.callback_url,
      return_url: payapp.return_url,
      domain_url: payapp.domain_url,
      ...payapp.config
    }
  }

  randomString(chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    let result = ''
    for (let i = 32; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
    return result
  }

  /**
   * 生成项目参数
   * @param data
   */

  private generatePayapp(data): Payapp {
    const payapp: any = {
      name: data.name,
      notify_url: data.notify_url,
      domain_url: data.domain_url,
      software_id: data.software_id,
      pay_app_type: data.pay_app_type,
      callback_url: data.callback_url,
      return_url: data.return_url,
      channel: data.channel
    }
    if (data.id) {
      payapp.id = +data.id
    } else {
      payapp.pay_app_id = this.randomString()
      payapp.pay_secret_key = this.randomString()
    }
    if (data.channel === 'wechat') {
      payapp.config = JSON.stringify({
        appid: data.appid,
        mch_id: data.mch_id,
        mch_key: data.mch_key,
        app_secret: data.app_secret,
        apiclient_cert: data.apiclient_cert
      })
    } else if (data.certificate == 10) {
      payapp.config = JSON.stringify({
        appid: data.appid,
        certificate: data.certificate,
        private_key: `-----BEGIN RSA PRIVATE KEY-----\r\n${data.private_key}\r\n-----END RSA PRIVATE KEY-----`,
        public_key: `-----BEGIN PUBLIC KEY-----\r\n${data.public_key}\r\n-----END PUBLIC KEY-----`
      })
    } else if (data.certificate == 20) {
      payapp.config = {
        appid: data.appid,
        certificate: data.certificate,
        private_key: data.private_key,
        public_key: data.public_key,
        app_cert_public_key: data.app_cert_public_key,
        alipay_cert_public_key_rsa2: data.alipay_cert_public_key_rsa2,
        alipay_root_cert: data.alipay_root_cert
      }
    }
    return payapp
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
