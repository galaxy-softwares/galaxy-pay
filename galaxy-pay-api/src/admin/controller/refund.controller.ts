import { Controller, ValidationPipe, UseGuards, UsePipes, Get } from '@nestjs/common'
import { JwtAuthGuard } from '../service'
import { RefundService } from '../service/refund.service'

@Controller('refund')
@UsePipes(new ValidationPipe())
@UseGuards(JwtAuthGuard)
export class RefundController {
  constructor(private readonly refundService: RefundService) {}

  @Get()
  async find() {
    return this.refundService.find()
  }
}
