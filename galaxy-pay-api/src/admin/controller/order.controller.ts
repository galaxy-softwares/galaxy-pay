import { Controller, ValidationPipe, UseGuards, UsePipes, Get } from '@nestjs/common';
import { OrderService } from '../service/order.service';
import { JwtAuthGuard } from '../service/jwt-auth.guard';

@Controller("order")
@UsePipes(new ValidationPipe())
@UseGuards(JwtAuthGuard)
export class OrderController {

    constructor(
        private readonly orderService: OrderService,
    ) {}
    
    @Get()
    async find() {
        return this.orderService.find();
    }
}
