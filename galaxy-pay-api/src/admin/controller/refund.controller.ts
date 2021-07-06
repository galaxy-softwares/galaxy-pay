import { Controller, ValidationPipe, UseGuards, UsePipes, Get, Query } from '@nestjs/common'
import { FindTradeParamDto } from '../dtos/base.dto'
import { JwtAuthGuard } from '../service'
import { RefundService } from '../service/refund.service'

@Controller('refund')
@UsePipes(new ValidationPipe())
@UseGuards(JwtAuthGuard)
export class RefundController {
  constructor(private readonly refundService: RefundService) {}

  @Get()
  async find(@Query() query: FindTradeParamDto) {
    return this.refundService.find(query)
  }
}
