import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RefundTrade } from "src/common/entities/refund.trade.entity";
import { Repository } from "typeorm";
import { TradeChannel, TradeStatus } from 'src/common/enum/trade.enum';
import { BaseService } from "./base.service";
import { AliPayRefundDto, WechatRefundPayDto } from "src/common/dtos/refund.dto";
import { WechatPayDto } from "src/common/dtos/pay.dto";
import bodyParser from "body-parser";
import { CreateRefundTrade } from "src/common/interceptor/refund.trade.interceptor";

@Injectable()
export class RefundTradeService extends BaseService<RefundTrade> {

    constructor(
        @InjectRepository(RefundTrade)
        private readonly refundTradeRepository: Repository<RefundTrade>,
      ) {
        super(refundTradeRepository);
    }

    /**
     * 查询未付款的订单
     * @param where 
     */
    async findUnPaidTrade(out_trade_no: string, channel: TradeChannel): Promise<RefundTrade> {
        try {
            return await this.refundTradeRepository.findOne({
                out_trade_no,
                trade_status: TradeStatus.UnPaid,
                trade_channel: channel,
            });
        } catch (error) {
            throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 创建退款订单
     * @param data RefundTrade
     */
    async createRefdunTrade(data: CreateRefundTrade, channel: TradeChannel): Promise<RefundTrade> {
        try {
            const trade = await this.findUnPaidTrade(data.out_trade_no, channel);
            // 如果有这个订单那么只能修改 金额 备注  回调url 和金额
            if (trade) {
                trade.trade_amount = data.trade_amount;
                trade.trade_refund_amount = data.trade_refund_amount;
                trade.trade_body = data.trade_body;
                trade.callback_url = data.callback_url;
                return this.repository.save(data);
            } else {
                return this.repository.save(data);
            }
        } catch (error) {
            throw new HttpException(error.toString(), HttpStatus.BAD_REQUEST);
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