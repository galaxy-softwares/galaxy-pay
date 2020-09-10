import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { SoftwareService } from 'src/admin/service/software.service';
import { OrderChannel } from '../entities/order.entity';

@Injectable()
export class PayGuard implements CanActivate {
  constructor(private softwareService: SoftwareService) {}

  async canActivate(context: ExecutionContext): Promise<boolean>{
    const request = context.switchToHttp().getRequest();
    const { query: { appid }, headers: { host } } = request;
    console.log(host);
    const data = await this.softwareService.findSoftwarePay(appid, OrderChannel.alipay);
    console.log(data);
    return true;
  }
}