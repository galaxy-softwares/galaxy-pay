import { Injectable } from '@nestjs/common'
import { BaseService } from './base.service'
import { Software } from 'src/admin/entities/software.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
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
      softwar_id: data.softwar_id,
      payapp_type: data.payapp_type
    }
    if (data.id) {
      payapp.id = data.id
    } else {
      payapp.payapp_id = this.randomString()
      payapp.payapp_secret_key = this.randomString()
    }
    if (data.channel === 'wechat') {
      payapp.config = JSON.stringify({
        appid: data.appid,
        mch_id: data.mch_id,
        mch_key: data.mch_key,
        app_secret: data.app_secret,
        callback_url: data.callback_url,
        return_url: data.return_url,
        apiclient_cert: data.apiclient_cert
      })
    } else {
      payapp.config = JSON.stringify({
        appid: data.appid,
        private_key: data.private_key,
        public_key: data.public_key,
        callback_url: data.callback_url,
        return_url: data.return_url
      })
    }
    return payapp
  }

  async createPayapp(data: PayappDto): Promise<Payapp> {
    const software = this.payappRepository.create(this.generatePayapp(data))
    return await this.payappRepository.save(software)
  }
}
