import { Controller, Get, UsePipes, UseGuards, Post, Body, Param, Put, Request } from '@nestjs/common';
import { SoftwareService } from '../service/software.service';
import { JwtAuthGuard } from '../service/jwt-auth.guard';
import { ValidationPipe } from 'src/common/pipe/validation.pipe';

@Controller("software")
@UsePipes(new ValidationPipe())
@UseGuards(JwtAuthGuard)
export class SoftwareController {
    constructor(
        private readonly softwareService: SoftwareService,
    ) {}

    @Get()
    get() {
        return this.softwareService.find();
    }

    @Get(":id/:channel")
    detail(@Param() param) {
        return this.softwareService.findSoftware(param.id, param.channel);
    }

    @Post()
    async create(@Request() request, @Body() data): Promise<any> {
        const { headers: { host } } = request;
        if (data.channel == 'wechat') {
            data.notify_url = `${host}/wechat_notify_url`;
            data.refund_notify_url = `${host}/wechat_refund_notify_url`;
        } else {
            data.notify_url = `${host}/alipay_notify_url`;
        }
        return await this.softwareService.create(data);
    }

    @Put()
    async update(@Request() request, @Body() data) {
        // 获取本机得域名
        const { headers: { host } } = request;
        if (data.channel == 'wechat') {
            data.notify_url = `${host}/wechat_notify_url`;
            data.refund_notify_url = `${host}/wechat_refund_notify_url`;
        } else {
            data.notify_url = `${host}/alipay_notify_url`;
        }
        return await this.softwareService.update(data);
    }
}