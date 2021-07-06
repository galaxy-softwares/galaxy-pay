import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TradeStatus } from 'src/common/enum/trade.enum'
import { CreateRefund } from 'src/common/interfaces'
import { Repository } from 'typeorm'
import { Payapp } from '../entities'
import { Refund } from '../entities/refund.entity'
import { BaseService } from './base.service'

@Injectable()
export class RefundService extends BaseService<Refund> {
  constructor(
    @InjectRepository(Refund)
    private readonly refundRepository: Repository<Refund>
  ) {
    super(refundRepository)
  }

  async find(): Promise<any> {
    try {
      const data = await this.refundRepository
        .createQueryBuilder('trade')
        .leftJoinAndMapOne('trade.payapp', Payapp, 'payapp', 'trade.pay_app_id = payapp.pay_app_id')
        .orderBy('trade.id', 'ASC')
        .getManyAndCount()
      return {
        data: data[0],
        count: data[1]
      }
    } catch (e) {
      throw new HttpException(`退款账单获取失败！${e}`, HttpStatus.BAD_REQUEST)
    }
  }

  async createRefund(refundData: CreateRefund): Promise<Refund> {
    const refund = await this.refundRepository.findOne({
      sys_refund_no: refundData.sys_refund_no
    })
    if (refund) {
      return refund
    } else {
      return await this.refundRepository.save(refundData)
    }
  }

  async isRefundSuccessful(sys_trade_no: string, sys_transaction_no: string): Promise<Refund> {
    const refund = await this.refundRepository.findOne({
      sys_refund_no: sys_trade_no
    })
    if (refund) {
      if (refund.status == TradeStatus.Success) {
        return refund
      }
      refund.sys_transaction_no = sys_transaction_no
      refund.status = TradeStatus.Success
      return await this.repository.save(refund)
    } else {
      throw new HttpException(`未查询到退款账单!`, HttpStatus.BAD_REQUEST)
    }
  }
}
