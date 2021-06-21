import { Controller, Get, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common'
import { JwtAuthGuard } from '../service'

@Controller('merchant')
@UsePipes(new ValidationPipe())
@UseGuards(JwtAuthGuard)
export class MerchantController {
  @Get()
  get() {}
}
