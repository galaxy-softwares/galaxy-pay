import { Controller, ValidationPipe, UseGuards, UsePipes, Get, Query } from '@nestjs/common'
import { FindTradeParamDto } from '../dtos/base.dto'

import { TradeService, JwtAuthGuard } from '../service'

@Controller('trade')
@UsePipes(new ValidationPipe())
@UseGuards(JwtAuthGuard)
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Get()
  async find(@Query() query: FindTradeParamDto) {
    return this.tradeService.find(query)
  }
}
