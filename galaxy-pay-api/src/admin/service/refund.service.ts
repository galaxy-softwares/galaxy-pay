import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from './base.service';
import { Order, OrderStatus, OrderChannel } from 'src/common/entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Refund } from 'src/common/entities/refund.entity';

@Injectable()
export class RefundService extends BaseService<Refund> {
    constructor(
        @InjectRepository(Refund)
        private readonly refundRepository: Repository<Refund>,
      ) {
        super(refundRepository);
    }

    async find(): Promise<Array<Refund>> {
       return await this.refundRepository.find(); 
    }

    /**
     * 创建订单
     * @param data 
     */
    async create(data): Promise<Order> {
        try {
            return await this.refundRepository.save(data);
        } catch (e) {
            throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        } 
    }

    /**
     * 寻找订单
     * @param out_trade_no 
     */
    async findOrder(out_trade_no: string) {
        try {
            return this.refundRepository.findOne({
                out_trade_no,
            })
        } catch (error) {
            throw new HttpException("没有找到退款订单！", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 判断退款是否完成
     * @param out_trade_no 
     * 
     */
    async refundSuccess(out_trade_no: string, channel: OrderChannel): Promise<boolean> {
        const order = await this.refundRepository.findOne({
            out_trade_no,
            order_status: OrderStatus.UnPaid,
            order_channel: channel
        })
        if (order) {
            order.order_status = OrderStatus.UnPaid;
            if (await this.refundRepository.save(order)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 更更新订单
     * @param data 
     */
    async update(data: Refund): Promise<Refund> {
        const order = this.refundRepository.create(data);
        return await this.refundRepository.save(order);
      }
    
}