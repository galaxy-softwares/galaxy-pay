import { Controller, Get, UsePipes, UseGuards, Post, Body, Param, Put } from '@nestjs/common'
import { JwtAuthGuard } from '../service'
import { ValidationPipe } from 'src/common/pipe/validation.pipe'
import { PayappService } from '../service/payapp.service'
import { Payapp } from '../entities'
import { PayappDto } from '../dtos/payapp.dto'

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
  async create(@Body() payapp: PayappDto): Promise<Payapp> {
    return await this.payappService.createPayapp(payapp)
  }

  @Put()
  async update(@Body() payapp: PayappDto): Promise<Payapp> {
    return await this.payappService.updatePayapp(payapp)
  }
}
