import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from './base.service';
import { Order, OrderStatus, OrderChannel } from 'src/common/entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AliPayDto, WechatPayDto } from 'src/common/dtos/pay.dto';


@Injectable()
export class OrderService extends BaseService<Order> {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
      ) {
        super(orderRepository);
    }

    async find(): Promise<Array<Order>> {
       return await this.orderRepository.find(); 
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
     * 根据订单编号查询订单订单
     * @param out_trade_no string
     */
    async findOrder(out_trade_no: string) {
        try {
            return this.orderRepository.findOne({
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
    async paySuccess(out_trade_no: string, channel: OrderChannel, trade_no: string): Promise<boolean> {
        try {
            const order = await this.orderRepository.findOne({
                out_trade_no,
                order_status: OrderStatus.UnPaid,
                order_channel: channel,
            })
            if (order) {
                order.trade_no = trade_no;
                order.order_status = OrderStatus.Success;
                if (await this.orderRepository.save(order)) {
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
     * @param data Order
     */
    async update(data: Order): Promise<Order> {
        try { 
            const order = this.orderRepository.create(data);
            return await this.orderRepository.save(order);
        } catch(e) {
            throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
        }
      }
    
}