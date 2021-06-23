import { Controller, Get, UsePipes, UseGuards, Post, Body, Request } from '@nestjs/common'
import { JwtAuthGuard } from '../service'
import { ValidationPipe } from 'src/common/pipe/validation.pipe'
import { PayappService } from '../service/payapp.service'
import { PayappDto } from '../dtos/pay.dto'

@Controller('payapp')
@UsePipes(new ValidationPipe())
@UseGuards(JwtAuthGuard)
export class PayappController {
  constructor(private readonly payappService: PayappService) {}

  @Get()
  get() {
    return this.payappService.findPayapp()
  }

  @Post()
  async create(@Request() request, @Body() data: PayappDto): Promise<any> {
    return await this.payappService.createPayapp(data)
  }
}
