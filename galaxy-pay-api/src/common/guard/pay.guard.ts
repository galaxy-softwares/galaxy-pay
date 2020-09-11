import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { SoftwareService } from 'src/admin/service/software.service';
import { OrderChannel } from '../entities/order.entity';

@Injectable()
export class PayGuard implements CanActivate {
  constructor(private softwareService: SoftwareService) {}

  async canActivate(context: ExecutionContext): Promise<boolean>{
    const request = context.switchToHttp().getRequest();
    const { body: { appid }, headers: { host } } = request;
    const payConfig = await this.softwareService.findSoftwarePay(appid);
    console.log(payConfig);
    if (host === payConfig.domain_url) {
      throw new HttpException(`很抱歉，你的请求域名不在当前允许范围内！`, HttpStatus.FORBIDDEN);
    }
    request.payConfig = payConfig;
    return true;
  }
}