import {
  Controller,
  Get,
  UsePipes,
  UseGuards,
  Post,
  Body,
  Param,
  Put,
  Request,
} from '@nestjs/common';
import { SoftwareService, JwtAuthGuard } from '../service';
import { ValidationPipe } from 'src/common/pipe/validation.pipe';
import { TradeChannel } from 'src/common/enum/trade.enum';
import { SoftwareDto } from '../dtos/software.dto';

@Controller('software')
@UsePipes(new ValidationPipe())
@UseGuards(JwtAuthGuard)
export class SoftwareController {
  constructor(private readonly softwareService: SoftwareService) {}

  @Get()
  get() {
    return this.softwareService.find();
  }

  @Get(':id/:channel')
  detail(@Param() param) {
    return this.softwareService.findSoftware(param.id);
  }

  @Post()
  async create(@Request() request, @Body() data: SoftwareDto): Promise<any> {
    const {
      headers: { host },
    } = request;
    if (data.channel == TradeChannel.wechat) {
      data.notify_url = `${host}/wechat_notify_url`;
    } else {
      data.notify_url = `${host}/alipay_notify_url`;
    }
    return await this.softwareService.createSoftware(data);
  }

  @Put()
  async update(@Request() request, @Body() data: SoftwareDto) {
    // 获取本机得域名
    const {
      headers: { host },
    } = request;
    if (data.channel == TradeChannel.wechat) {
      data.notify_url = `${host}/wechat_notify_url`;
    } else {
      data.notify_url = `${host}/alipay_notify_url`;
    }
    return await this.softwareService.updateSoftware(data);
  }
}
