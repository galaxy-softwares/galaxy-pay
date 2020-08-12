import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from './base.service';
import { Order, OrderStatus, OrderChanle } from 'src/common/entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class OrderService extends BaseService<Order> {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
      ) {
        super(orderRepository);
    }

    /**
     * 创建订单
     * @param data 
     */
    async create(data): Promise<Order> {
        try {
            return await this.orderRepository.save(data);
        } catch (e) {
            throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        } 
    }

    /**
     * 寻找未支付订单 为支付宝或者微信回调使用。
     * @param out_trade_no 
     */
    async findOrder(out_trade_no: string, chanle: OrderChanle) {
        return this.orderRepository.findOne({
            out_trade_no,
            order_chanle: chanle
        })
    }

    /**
     * 判断支付是否完成
     * @param out_trade_no 
     * 
     */
    async paySuccess(out_trade_no: string, chanle: OrderChanle): Promise<boolean> {
        const order = await this.orderRepository.findOne({
            out_trade_no,
            order_status: OrderStatus.UnPaid,
            order_chanle: chanle
        })
        if (order) {
            order.order_status = OrderStatus.Success;
            if (await this.orderRepository.save(order)) {
                return true;
            }
        }
        return false;
    }
    
}