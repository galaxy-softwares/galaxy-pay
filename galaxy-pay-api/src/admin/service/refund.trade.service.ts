import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RefundTrade } from "src/common/entities/refund.trade.entity";
import { Repository } from "typeorm";
import { TradeChannel, TradeStatus } from 'src/common/enum/trade.enum';
import { BaseService } from "./base.service";
import { CreateRefundTrade } from "src/common/interfaces/refund.trade.interfaces";
import { Software } from "src/common/entities/software.entity";

@Injectable()
export class RefundTradeService extends BaseService<RefundTrade> {

    constructor(
        @InjectRepository(RefundTrade)
        private readonly refundTradeRepository: Repository<RefundTrade>,
      ) {
        super(refundTradeRepository);
    }

    async find(): Promise<any> {
        try { 
            const income = await this.refundTradeRepository.createQueryBuilder("trade").where({
                trade_status: TradeStatus.Success
            }).select("SUM(trade.trade_amount)", "amount").addSelect("COUNT(*) AS count").getRawOne()
            const data = await this.refundTradeRepository.createQueryBuilder("trade").leftJoinAndMapOne('trade.software', Software, 'software', 'trade.appid = software.appid').orderBy("trade.id", 'ASC').getManyAndCount()
            return {
                data: data[0],
                count: data[1],
                income: income,
            }
        } catch(e) {
            console.log(e);
        }
    }

    // /**
    //  * 查询未付款的订单
    //  * @param where 
    //  */
    async findUnPaidTrade(out_trade_no: string, channel: TradeChannel): Promise<RefundTrade> {
        return await this.refundTradeRepository.findOne({
            out_trade_no,
            trade_status: TradeStatus.UnPaid,
            trade_channel: channel,
        });
    }

    /**
     * 查询退款订单
     * @param out_trade_no 
     * @param channel 
     */
    async findRefundTrade(out_trade_no: string, channel: TradeChannel) {
        const refund_trade = await this.refundTradeRepository.findOne({
            out_trade_no,
            trade_channel: channel,
        });
        if (refund_trade) {
            if (refund_trade.trade_status === TradeStatus.UnPaid) {
                return refund_trade
            } else {
                throw new HttpException("当前账单退款完成！", HttpStatus.BAD_REQUEST);
            }
        }
        return null;
    }

    /**
     * 创建退款订单
     * @param data RefundTrade
     */
    async createRefdunTrade(data: CreateRefundTrade, channel: TradeChannel): Promise<RefundTrade> {
        const trade = await this.findRefundTrade(data.out_trade_no,channel);
        // 如果有这个订单那么只能修改 金额 备注  回调url 和金额
        if (trade && trade.trade_status === TradeStatus.UnPaid) {
            trade.trade_amount = data.trade_amount;
            trade.trade_refund_amount = data.trade_refund_amount;
            trade.trade_body = data.trade_body;
            trade.callback_url = data.callback_url;
            return this.repository.save(trade);
        } else {
            return this.repository.save(data);
        }
    }

    /**
     * 判断账单是否退款成功
     * @param out_trade_no string
     * @param channel string
     * @param trade_no string
     */
    async refundTradeSuccess(out_trade_no: string, channel: TradeChannel, trade_no: string): Promise<RefundTrade> {
        try {
            const refund_trade = await this.findUnPaidTrade(
                out_trade_no,
                channel
            );
            if (refund_trade) {
                refund_trade.trade_no = trade_no;
                refund_trade.trade_status = TradeStatus.Success;
                return await this.refundTradeRepository.save(refund_trade);
            }
        } catch (error) {
            throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
        }
    }


}