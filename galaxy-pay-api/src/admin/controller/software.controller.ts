import { Controller, Get, UsePipes, UseGuards, Post, Body } from '@nestjs/common'
import { SoftwareService, JwtAuthGuard } from '../service'
import { ValidationPipe } from 'src/common/pipe/validation.pipe'
import { SoftwareDto } from '../dtos/base.dto'

@Controller('software')
@UsePipes(new ValidationPipe())
@UseGuards(JwtAuthGuard)
export class SoftwareController {
  constructor(private readonly softwareService: SoftwareService) {}

  @Get()
  get() {
    return this.softwareService.find()
  }

  @Post()
  async create(@Body() data: SoftwareDto): Promise<any> {
    return await this.softwareService.createSoftware(data)
  }
}
