import { Injectable } from '@nestjs/common'
import { BaseService } from './base.service'
import { InjectRepository } from '@nestjs/typeorm'
import { createQueryBuilder, Repository } from 'typeorm'
import { Payapp, Software } from '../entities'
import { joinPath, randomString } from 'src/common/utils/indedx'
import { PayappDto } from '../dtos/payapp.dto'
import { TradeChannel } from 'src/common/enum/trade.enum'
import { PayappData, PayappEntity } from 'src/common/interfaces'

@Injectable()
export class PayappService extends BaseService<Payapp> {
  constructor(
    @InjectRepository(Payapp)
    private readonly payappRepository: Repository<Payapp>
  ) {
    super(payappRepository)
  }

  /**
   * 生成项目参数
   * @param data PayappDto
   */
  private generatePayapp(payappData: PayappDto): PayappEntity {
    const payapp: PayappData = {
      name: payappData.name,
      software_id: payappData.software_id,
      callback_url: payappData.callback_url,
      domain_url: payappData.domain_url,
      notify_url: payappData.notify_url,
      return_url: payappData.return_url,
      channel: payappData.channel
    } as PayappData
    if (payappData.id) {
      payapp.id = +payappData.id
    } else {
      payapp.pay_app_id = randomString()
      payapp.pay_secret_key = randomString()
    }
    if (payappData.channel === TradeChannel.wechat) {
      payapp.config = {
        appid: payappData.appid,
        mch_id: payappData.mch_id,
        mch_key: payappData.mch_key,
        app_secret: payappData.app_secret,
        apiclient_cert: joinPath(payappData.apiclient_cert)
      }
    } else {
      payapp.config = {
        appid: payappData.appid,
        certificate: payappData.certificate,
        private_key: payappData.private_key,
        app_cert_sn: payappData.app_cert_sn,
        public_key: payappData.public_key,
        alipay_root_cert_sn: payappData.alipay_root_cert_sn
      }
    }
    return {
      ...payapp,
      config: JSON.stringify(payapp.config)
    }
  }

  async findOneByPayappId(pay_app_id: string) {
    return await this.payappRepository.findOne({ pay_app_id })
  }

  async createPayapp(data: PayappDto): Promise<Payapp> {
    const payapp = this.payappRepository.create(this.generatePayapp(data))
    return await this.payappRepository.save(payapp)
  }

  async updatePayapp(data: PayappDto): Promise<Payapp> {
    const payapp = this.payappRepository.create(this.generatePayapp(data))
    return await this.payappRepository.save(payapp)
  }

  async findPayapp(query: { name: string; channel: TradeChannel }) {
    let whereAndSql = ''
    if (query.name) {
      whereAndSql += `and app.name = '${query.name}'`
    }
    if (query.channel) {
      whereAndSql += `and app.channel = '${query.channel}'`
    }
    return this.payappRepository.query(
      `select app.id, app.name, app.pay_app_id, app.pay_secret_key, app.channel, software.name as software_name from payapp app left join software software on app.software_id = software.id where 1=1 ${whereAndSql}`
    )
  }
}
