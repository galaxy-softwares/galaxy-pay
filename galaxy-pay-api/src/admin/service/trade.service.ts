import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from './base.service';
import { Trade } from 'src/common/entities/trade.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Software } from 'src/common/entities/software.entity';
import { TradeAccountType, TradeChannel, TradeStatus } from 'src/common/enum/trade.enum';


@Injectable()
export class TradeService extends BaseService<Trade> {
    constructor(
        @InjectRepository(Trade)
        private readonly tradeRepository: Repository<Trade>,
      ) {
        super(tradeRepository);
    }

    /**
     * 查询账单
     */
    async find(): Promise<any> {
        const income = await this.tradeRepository.createQueryBuilder("trade").where({
            trade_type: '0',
            trade_status: TradeStatus.Success
        }).select("SUM(trade.trade_amount)", "amount").addSelect("COUNT(*) AS count").getRawOne()
        const expenditure  = await this.tradeRepository.createQueryBuilder("trade").where({
            trade_type: '1',
            trade_status: TradeStatus.Success
        }).select("SUM(trade.trade_amount)", "amount").addSelect("COUNT(*) AS count").getRawOne();
        console.log(expenditure);
        const data = await this.tradeRepository.createQueryBuilder("trade").leftJoinAndMapOne('trade.software', Software, 'software', 'trade.appid = software.appid').orderBy("trade.id", 'ASC').getManyAndCount()
        return {
            data: data[0],
            count: data[1],
            income: income,
            expenditure: expenditure,
        }
    }

    /**
     * 根据任意条件查询一条订单
     * @param where 
     */
    async findOneByWhere(where: any): Promise<Trade> {
        try {
            return await this.tradeRepository.findOne(where);
        } catch (e) {
            throw new HttpException("没有查询到订单", HttpStatus.BAD_REQUEST);
        } 
    }

    /**
     * 创建订单
     * @param data 
     */
    async create(data): Promise<Trade> {
        try {
            return await this.tradeRepository.save(data);
        } catch (e) {
            throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        } 
    }

    /**
     * 根据订单编号查询订单订单
     * @param out_trade_no string
     */
    async findOrder(out_trade_no: string) {
        try {
            return this.tradeRepository.findOne({
                out_trade_no,
            })
        } catch (e) {
            throw new HttpException("没有查询到订单", HttpStatus.BAD_REQUEST);
        } 
    }

    /**
     * 判断支付是否完成
     * @param out_trade_no string 订单编号
     * @param channel OrderChannel 订单类型
     * @param trade_no string 支付宝或者微信的支付订单号
     * 
     */
    async paySuccess(out_trade_no: string, channel: TradeChannel, trade_no: string): Promise<boolean> {
        try {
            const order = await this.tradeRepository.findOne({
                out_trade_no,
                trade_status: TradeStatus.UnPaid,
                trade_channel: channel,
            })
            if (order) {
                order.trade_no = trade_no;
                order.trade_status = TradeStatus.Success;
                if (await this.tradeRepository.save(order)) {
                    return true;
                }
            }
            return false;
        } catch(e) {
            throw new HttpException("订单支付状态查询失败！", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 判断订单是否退款完成
     * @param data 
     */
    async refundSuccess(out_trade_no: string, trade_no: string, channel: TradeChannel): Promise<Boolean> {
        try {
            const order = await this.tradeRepository.findOne({
                out_trade_no,
                trade_status: TradeStatus.UnPaid,
                trade_channel: channel,
                trade_account_type: TradeAccountType.refund
            })
            if (order) {
                order.trade_no = trade_no;
                order.trade_status = TradeStatus.Success;
                if (await this.tradeRepository.save(order)) {
                    return true;
                }
            }
            return false;
        } catch(e) {
            throw new HttpException("订单支付状态查询失败！", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 更更新订单
     * @param data Trade
     */
    async update(data: Trade): Promise<Trade> {
        try { 
            const order = this.tradeRepository.create(data);
            return await this.tradeRepository.save(order);
        } catch(e) {
            throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        }
      }
    
}