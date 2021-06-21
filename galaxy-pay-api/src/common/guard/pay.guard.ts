import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common'
import { SoftwareService } from 'src/admin/service/software.service'
import { makeSignStr } from '../utils/indedx'

@Injectable()
export class PayGuard implements CanActivate {
  constructor(private softwareService: SoftwareService) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest()
    const {
      body,
      headers: { host }
    } = request

    const { domain_url, secret_key, payConfig } = await this.softwareService.findSoftwarePayConfig(body.appid)

    if (domain_url.indexOf(host) < 0) {
      throw new HttpException(`很抱歉，你的请求域名不在当前允许范围内！`, HttpStatus.FORBIDDEN)
    }
    // // 先判断是否存在sign 参数，如果有的话就开始进行加密校验。
    if (body?.sign) {
      const sign = body.sign
      delete body.sign
      if (sign != makeSignStr(body, secret_key)) {
        throw new HttpException('加密签名校验不通过！', HttpStatus.BAD_REQUEST)
      }
    }
    // 先在这里进行判断下，然后在配置的时候就不用再去麻烦再去写配置了。
    if (body?.notify_url) {
      payConfig.notify_url = body.notify_url
    }
    if (body?.callback_url) {
      payConfig.callback_url = body.callback_url
    }
    if (body?.return_url) {
      payConfig.return_url = body.return_url
    }
    request.payConfig = payConfig
    return true
  }
}
