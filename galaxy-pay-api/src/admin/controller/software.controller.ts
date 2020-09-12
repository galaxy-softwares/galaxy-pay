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
    async create(@Request() req, @Body() data): Promise<any> {
        // 获取本机得域名
        return await this.softwareService.create(data);
    }

    @Put()
    async update(@Request() req, @Body() data) {
        // 获取本机得域名
        return await this.softwareService.update(data);
    }
}