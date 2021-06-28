import { Controller, Get, UsePipes, UseGuards, Post, Body, Request, Param, Put } from '@nestjs/common'
import { JwtAuthGuard } from '../service'
import { ValidationPipe } from 'src/common/pipe/validation.pipe'
import { PayappService } from '../service/payapp.service'
import { PayappDto } from '../dtos/pay.dto'
import { Payapp } from '../entities'

@Controller('payapp')
@UsePipes(new ValidationPipe())
@UseGuards(JwtAuthGuard)
export class PayappController {
  constructor(private readonly payappService: PayappService) {}

  @Get()
  get() {
    return this.payappService.findPayapp()
  }

  @Get(':id')
  async getPayapp(@Param() params) {
    const payapp = await this.payappService.findOneById(params.id)
    return { ...payapp, ...JSON.parse(payapp.config) }
  }

  @Post()
  async create(@Body() data: PayappDto): Promise<Payapp> {
    return await this.payappService.createPayapp(data)
  }

  @Put()
  async update(@Body() data: PayappDto): Promise<Payapp> {
    return await this.payappService.updatePayapp(data)
  }
}
