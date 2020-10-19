import { Controller, ValidationPipe, UseGuards, UsePipes, Get } from '@nestjs/common';
import { JwtAuthGuard, RefundTradeService } from '../service';

@Controller('refund')
@UsePipes(new ValidationPipe())
@UseGuards(JwtAuthGuard)
export class RefundController {
  constructor(private readonly refundTradeService: RefundTradeService) {}

  @Get()
  async find() {
    return this.refundTradeService.find();
  }
}
