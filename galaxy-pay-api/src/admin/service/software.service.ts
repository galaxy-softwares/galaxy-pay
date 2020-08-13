import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from './base.service';
import { Software } from 'src/common/entities/software.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SoftwareDto } from 'src/common/dtos/software.dto';
import { OrderChannel } from 'src/common/entities/order.entity';

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
  async findSoftwarePay(appid: string, channel: OrderChannel) {
    const data = await this.softwareRepository.findOne({
      appid,
      channel: channel
    });
    return data;
  }

  /**
  * 
  * @param id string
  */
  async findSoftware(id: string, channel: OrderChannel) {
    const data = await this.softwareRepository.findOne({
      id,
      channel
    });
    if(!data) {
      throw new HttpException(`没有找到项目${channel}`, HttpStatus.BAD_REQUEST);
    }
    try {
      if (channel === OrderChannel.wechat) {
        const wechat = JSON.parse(data.wechat);
        delete data.wechat;
        return {...data, ...wechat}
      } else {
        const alipay = JSON.parse(data.alipay);
        delete data.alipay;
        return {...data, ...alipay}
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
  randomString(chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")  {
    let result = '';
    for (let i = 32; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  /**
   * 创建项目
   * @param data SoftwareDto
   */
  async create(data: SoftwareDto): Promise<Software> {
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
        app_id: data.app_id,
        debug: data.debug,
        mch_id: data.mch_id,
        mch_key: data.mch_key,
        app_secret: data.app_secret,
        ssl_cer: data.ssl_cer,
        ssl_key: data.ssl_key,
      }
    } else {
      alipay = {
        app_id: data.app_id,
        debug: data.debug,
        private_key: data.private_key,
        public_key: data.public_key,
      }
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
    }
    return software;
  } 

  /**
   * 更新项目
   * @param data SoftwareDto
   */
  async update(data: SoftwareDto): Promise<Software> {
    const software = this.softwareRepository.create(this.generateSoftware(data));
    return await this.softwareRepository.save(software);
  }

  /**
   * 
   * @param prefix string 要加上去的前缀
   * @param object 对象
   */
  addPrefix(prefix: string, object: any) {
    const newObject = {}
    for (const name in object) {
      if (typeof object[name] != "object") {
        newObject[`${prefix}_${name}`] = object[name];
      }
    }
    return newObject;
  }
  // /**
  //  * 
  //  * @param number string 删掉几位
  //  * @param object 对象
  //  */
  // deletePrefix(number: number, object: any) {
  //   const newObject = {}
  //   for (const name in object) {
  //     if (typeof object[name] != "object") {
  //       const newName = name.substring(number);
  //       newObject[newName] = object[name];
  //     }
  //   }
  //   return newObject;
  // }
  
}
