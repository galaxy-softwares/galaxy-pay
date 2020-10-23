import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from './base.service';
import { Software } from 'src/admin/entities/software.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TradeChannel } from 'src/common/enum/trade.enum';
import { SoftwareDto } from '../dtos/software.dto';
import { WechatConfig } from 'galaxy-pay-config';

@Injectable()
export class SoftwareService extends BaseService<Software> {
  constructor(
    @InjectRepository(Software)
    private readonly softwareRepository: Repository<Software>,
  ) {
    super(softwareRepository);
  }

  /**
   * 仅限给支付时使用
   * @param appid string
   */
  async findSoftwarePay(appid: string) {
    const software = await this.softwareRepository.findOne({ appid });
    if (software) {
      const payConfig =
        software.channel === TradeChannel.wechat
          ? JSON.parse(software.wechat)
          : JSON.parse(software.alipay);
      return {
        domain_url: software.domain_url.split(','),
        secret_key: software.secret_key,
        payConfig,
      };
    } else {
      throw new HttpException('未查询到支付配置,请检查appid', HttpStatus.BAD_REQUEST);
    }
  }

  public async findSoftwarePayConfig(appid: string) {
    try {
      const data = await this.softwareRepository.findOne({
        appid,
      });
      if (data.channel === TradeChannel.wechat) {
        return { wechatConfig: JSON.parse(data.wechat), secret_key: data.secret_key };
      } else {
        return { alipayConfig: JSON.parse(data.alipay), secret_key: data.secret_key };
      }
    } catch (e) {
      throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 根据微信appid 查找到对应的微(s)信(b)配置
   * @param wxappid
   */
  public async findSoftwareByWxAppid(wxappid: string): Promise<WechatConfig> {
    try {
      const data = await this.softwareRepository.find({
        channel: TradeChannel.wechat,
      });
      const result = data.find((item) => {
        return wxappid == JSON.parse(item.wechat).appid;
      });
      return JSON.parse(result.wechat);
    } catch (e) {
      throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
    }
  }

  /**
   *
   * @param id string
   */
  // async findSoftware(id: string, channel: OrderChannel) {
  //   const data = await this.softwareRepository.findOne({
  //     id,
  //     channel
  //   });
  //   if(!data) {
  //     throw new HttpException(`没有找到项目`, HttpStatus.BAD_REQUEST);
  //   }
  //   try {
  //     if (channel === OrderChannel.wechat) {
  //       const wechat = JSON.parse(data.wechat);
  //       delete data.wechat;
  //       return {...data, ...wechat}
  //     } else {
  //       const alipay = JSON.parse(data.alipay);
  //       delete data.alipay;
  //       return {...data, ...alipay}
  //     }
  //   } catch (e) {
  //     throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
  //   }
  // }

  // 用于修改使用
  async findSoftware(appid: string) {
    const data = await this.softwareRepository.findOne({
      appid,
    });
    if (!data) {
      throw new HttpException(`没有找到项目`, HttpStatus.BAD_REQUEST);
    }
    try {
      if (data.channel === TradeChannel.wechat) {
        const wechat = JSON.parse(data.wechat);
        delete data.wechat;
        return { ...data, ...wechat };
      } else {
        const alipay = JSON.parse(data.alipay);
        delete data.alipay;
        return { ...data, ...alipay };
      }
    } catch (e) {
      throw new HttpException(e.toString(), HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 查询项目（因为不会有太多的项目索性不做分页查询!）
   */
  find() {
    return this.softwareRepository.find();
  }

  /**
   * 生成随机字符串
   * @param chars string
   */
  randomString(chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    let result = '';
    for (let i = 32; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  /**
   * 创建项目
   * @param data SoftwareDto
   */
  async createSoftware(data: SoftwareDto): Promise<Software> {
    const software = this.softwareRepository.create(this.generateSoftware(data));
    return await this.softwareRepository.save(software);
  }

  /**
   * 生成项目参数
   * @param data SoftwareDto
   */
  private generateSoftware(data): Software {
    let alipay = {};
    let wechat = {};
    if (data.channel === 'wechat') {
      wechat = {
        appid: data.appid,
        debug: data.debug,
        mch_id: data.mch_id,
        mch_key: data.mch_key,
        app_secret: data.app_secret,
        ssl_cer: data.ssl_cer,
        ssl_key: data.ssl_key,
        callback_url: data.callback_url,
        return_url: data.return_url,
        notify_url: data.notify_url,
        refund_notify_url: data.refund_notify_url,
        apiclient_cert: data.apiclient_cert,
      };
    } else {
      alipay = {
        appid: data.appid,
        debug: data.debug,
        private_key: data.private_key,
        public_key: data.public_key,
        callback_url: data.callback_url,
        return_url: data.return_url,
        notify_url: data.notify_url,
      };
    }
    const software: any = {
      name: data.name,
      domain_url: data.domain_url,
      alipay: JSON.stringify(alipay),
      wechat: JSON.stringify(wechat),
    };
    if (data.id) {
      software.id = data.id;
    } else {
      software.appid = this.randomString();
      software.secret_key = this.randomString();
    }
    return software;
  }

  /**
   * 更新项目
   * @param data SoftwareDto
   */
  async updateSoftware(data: SoftwareDto): Promise<Software> {
    const software = this.softwareRepository.create(this.generateSoftware(data));
    return await this.softwareRepository.save(software);
  }
}
