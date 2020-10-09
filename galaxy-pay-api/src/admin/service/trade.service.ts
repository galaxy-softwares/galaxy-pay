import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from './base.service';
import { Trade } from 'src/common/entities/trade.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Software } from 'src/common/entities/software.entity';
import { TradeChannel, TradeStatus } from 'src/common/enum/trade.enum';
import { CreateTrade } from 'src/common/interceptor/trade.interceptor';


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
        // try { 
        //     const income = await this.tradeRepository.createQueryBuilder("trade").where({
        //         trade_status: TradeStatus.Success
        //     }).select("SUM(trade.trade_amount)", "amount").addSelect("COUNT(*) AS count").getRawOne()
        //     const expenditure  = await this.tradeRepository.createQueryBuilder("trade").where({
        //         trade_type: TradeType.expenditure,
        //         trade_status: TradeStatus.Success
        //     }).select("SUM(trade.trade_amount)", "amount").addSelect("COUNT(*) AS count").getRawOne();
        //     const data = await this.tradeRepository.createQueryBuilder("trade").leftJoinAndMapOne('trade.software', Software, 'software', 'trade.appid = software.appid').orderBy("trade.id", 'ASC').getManyAndCount()
        //     return {
        //         data: data[0],
        //         count: data[1],
        //         income: income,
        //         expenditure: expenditure,
        //     }
        // } catch(e) {
        //     console.log(e);
        // }
    }

    /**
     * 创建订单
     * @param data 
     */
    async createTrade(data: CreateTrade, channel: TradeChannel): Promise<Trade> {
        try {
            const trade = await this.tradeRepository.findOne({
                out_trade_no: data.out_trade_no,
            })
            if (trade) {
                trade.trade_channel = channel;
                trade.trade_body = data.trade_body;
                trade.trade_amount = data.trade_amount;
                trade.appid = data.appid;
                return await this.tradeRepository.save(trade);
            } else {
                return await this.tradeRepository.save(data);
            }
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
    async refundSuccess(out_trade_no: string, trade_no: string, channel: TradeChannel): Promise<boolean> {
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
    
}