import { Controller, Get, UsePipes, UseGuards, Post, Body, Delete, Query, Param } from '@nestjs/common'
import { SoftwareService, JwtAuthGuard } from '../service'
import { ValidationPipe } from 'src/common/pipe/validation.pipe'
import { SoftwareDto } from '../dtos/base.dto'
import { Software } from '../entities'

@Controller('software')
@UsePipes(new ValidationPipe())
@UseGuards(JwtAuthGuard)
export class SoftwareController {
  constructor(private readonly softwareService: SoftwareService) {}

  @Get()
  get() {
    return this.softwareService.find()
  }

  @Delete(':id')
  async deletePayapp(@Param() params) {
    if (await this.softwareService.delete(params.id)) {
      return { message: '删除成功！' }
    }
  }

  @Post()
  async create(@Body() data: SoftwareDto): Promise<Software> {
    return await this.softwareService.createSoftware(data)
  }
}
