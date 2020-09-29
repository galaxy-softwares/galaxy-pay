import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { SoftwareService } from 'src/admin/service/software.service';
import { OrderChannel } from '../entities/order.entity';
var qs = require('qs');
var md5 = require('md5');

@Injectable()
export class PayGuard implements CanActivate {
  constructor(private softwareService: SoftwareService) {}

  async canActivate(context: ExecutionContext): Promise<boolean>{
    const request = context.switchToHttp().getRequest();
    const { body, headers: { host } } = request;
    const software = await this.softwareService.findSoftwarePay(body.appid);
    
    if (host === software.domain_url) {
      throw new HttpException(`很抱歉，你的请求域名不在当前允许范围内！`, HttpStatus.FORBIDDEN);
    } 

    // 先判断是否存在sign 参数，如果有的话就开始进行加密校验。
    if (body?.sign) {
      const sign = body.sign;
      body.key = software.app_secret;
      delete body.sign;
      if (sign != this.makeSignStr(body, software.app_secret)) {
        throw new HttpException("加密签名校验不通过！", HttpStatus.BAD_REQUEST);
      }
    }
    const payConfig = software.channel === OrderChannel.wechat ? JSON.parse(software.wechat) : JSON.parse(software.alipay);
    // 先在这里进行判断下，然后在配置的时候就不用再去麻烦再去写配置了。
    if(body?.notify_url) {
      payConfig.notify_url = body.notify_url;
    } 
    if(body?.callback_url) {
      payConfig.callback_url = body.callback_url;
    } 
    if(body?.return_url) {
      payConfig.return_url = body.return_url;
    }
    request.payConfig = payConfig;
    return true;
  }

  /**
   * 生成签名
   * @param param
   * @param key 
   */
  makeSignStr(param: Object, key: string) {
    let params = this.sortByKey(param);
    let param_url = qs.stringify(params)
    let param_str = `${param_url}&key=${key}`;
    param_str = md5(param_str.toLocaleLowerCase())
    param_str = param_str.toLocaleUpperCase();
    return `${param_str}`;
  }

  /**
   * 排序
   * @param obj 
   */
  sortByKey(obj: Object) {
    const newkey = Object.keys(obj).sort();
    var newObj = {};
    for (var i = 0; i < newkey.length; i++) {
        newObj[newkey[i]] = obj[newkey[i]];
    }
    return newObj;
  }
}