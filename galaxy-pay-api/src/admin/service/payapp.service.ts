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
      domain_url: data.domain_url,
      software_id: data.software_id,
      pay_app_type: data.pay_app_type,
      callback_url: data.callback_url,
      return_url: data.return_url,
      channel: data.channel
    }
    if (data.id) {
      payapp.id = data.id
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
        private_key: data.private_key,
        public_key: data.public_key
      })
    } else if (data.certificate == 20) {
      payapp.config = JSON.stringify({
        appid: data.appid,
        certificate: data.certificate,
        app_cert_public_key: data.app_cert_public_key,
        alipay_cert_public_key: data.alipay_cert_public_key,
        alipay_root_cert: data.alipay_root_cert
      })
    }
    return payapp
  }

  async createPayapp(data: PayappDto): Promise<Payapp> {
    const payapp = this.payappRepository.create(this.generatePayapp(data))
    return await this.payappRepository.save(payapp)
  }

  async findPayapp() {
    const user = await createQueryBuilder(Payapp, 'payapp')
      // .leftJoinAndSelect('payapp.software', 'software', 'software.id = payapp.software_id')
      .leftJoinAndMapOne('payapp.software', Software, 'software', 'software.id = payapp.software_id')
      .getMany()
    console.log(user, '=====')
    return user
  }
}
