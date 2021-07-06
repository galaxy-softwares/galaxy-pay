import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { BaseService } from './base.service'
import { Trade } from 'src/admin/entities/trade.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TradeChannel, TradeStatus } from 'src/common/enum/trade.enum'
import { CreateTrade } from 'src/common/interfaces/trade.interfaces'
import { FindTradeParamDto } from '../dtos/base.dto'

@Injectable()
export class TradeService extends BaseService<Trade> {
  constructor(
    @InjectRepository(Trade)
    private readonly tradeRepository: Repository<Trade>
  ) {
    super(tradeRepository)
  }

  /**
   * 查询账单
   */
  async find(query: FindTradeParamDto): Promise<any> {
    try {
      let whereAndSql = ''
      if (query.sys_trade_no) {
        whereAndSql += `and trade.sys_refund_no = '${query.sys_trade_no}'`
      }
      if (query.channel) {
        whereAndSql += `and trade.trade_channel = '${query.channel}'`
      }

      return this.tradeRepository.query(
        `select trade.sys_trade_no, trade.sys_transaction_no, trade.trade_status, trade_amount, trade.trade_channel, app.name as pay_app_name, software.name as software_name from trade trade ` +
          `left join payapp app on trade.pay_app_id = app.pay_app_id ` +
          `left join software software on app.software_id = software.id ` +
          `where 1=1 ${whereAndSql}`
      )
    } catch (e) {
      throw new HttpException(`支付账单获取失败！${e}`, HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 创建订单
   * @param data
   */
  async createTrade(data: CreateTrade): Promise<Trade> {
    try {
      const trade = await this.tradeRepository.findOne({
        sys_trade_no: data.sys_trade_no
      })
      if (trade) {
        trade.trade_channel = data.trade_channel
        trade.trade_body = data.trade_body
        trade.trade_amount = data.trade_amount
        trade.pay_app_id = data.pay_app_id
        return await this.tradeRepository.save(trade)
      } else {
        return await this.tradeRepository.save(data)
      }
    } catch (e) {
      throw new HttpException(`支付账单生成失败！${e}`, HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 根据订单编号查询订单订单
   * @param sys_trade_no string
   */
  async findOrder(sys_trade_no: string) {
    try {
      return this.tradeRepository.findOne({
        sys_trade_no
      })
    } catch {
      throw new HttpException('没有查询到订单', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 判断支付是否完成
   * @param sys_trade_no string 订单编号
   * @param channel OrderChannel 订单类型
   * @param trade_no string 支付宝或者微信的支付订单号
   *
   */
  async editPayStatus(sys_trade_no: string, channel: TradeChannel, sys_transaction_no: string): Promise<Trade> {
    try {
      const trade = await this.tradeRepository.findOne({
        sys_trade_no,
        trade_status: TradeStatus.UnPaid,
        trade_channel: channel
      })
      if (trade && trade.trade_status === TradeStatus.Success) {
        return trade
      } else if (trade && trade.trade_status === TradeStatus.UnPaid) {
        trade.sys_transaction_no = sys_transaction_no
        trade.trade_status = TradeStatus.Success
        if (await this.tradeRepository.save(trade)) {
          return trade
        }
      }
      return null
    } catch (e) {
      throw new HttpException('订单支付状态修改失败！', HttpStatus.BAD_REQUEST)
    }
  }

  /**
   * 判断退款是否成功
   * @param sys_trade_no
   * @param channel
   * @param sys_transaction_no 支付宝同步返回的 trade_no
   */
  async refundSuccess(sys_trade_no: string, channel: TradeChannel, sys_transaction_no: string): Promise<Trade> {
    try {
      // const trade = await this.tradeRepository.findOne({
      //   sys_trade_no,
      //   trade_type: TradeType.Refund,
      //   trade_channel: channel
      // })
      // if (trade && trade.trade_status === TradeStatus.Success) {
      //   return trade
      // } else if (trade) {
      //   trade.sys_transaction_no = sys_transaction_no
      //   trade.trade_status = TradeStatus.Success
      //   if (await this.tradeRepository.save(trade)) {
      //     return trade
      //   }
      // }
      return null
    } catch (e) {
      throw new HttpException('订单支付状态修改失败！', HttpStatus.BAD_REQUEST)
    }
  }
}
