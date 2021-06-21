import { Controller, ValidationPipe, UseGuards, UsePipes, Get } from '@nestjs/common'
import { TradeService, JwtAuthGuard } from '../service'

@Controller('trade')
@UsePipes(new ValidationPipe())
@UseGuards(JwtAuthGuard)
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Get()
  async find() {
    return this.tradeService.find()
  }
}
