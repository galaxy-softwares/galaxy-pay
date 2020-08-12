import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { BaseService } from './base.service';
import { Software } from 'src/common/entities/software.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SoftwareDto } from 'src/common/dtos/software.dto';

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
    const data = await this.softwareRepository.findOne({appid});
    return data;
  }

  /**
  * 
  * @param id string
  */
  async findSoftware(id: string) {
    const data = await this.softwareRepository.findOne({id});
    try {
      console.log(JSON.parse(data.alipay));
      const alipay = this.addPrefix('alipay', JSON.parse(data.alipay));
      const wechat = this.addPrefix('wechat', JSON.parse(data.wechat));
      delete data.alipay;
      delete data.wechat;
      const software = {...data, ...alipay, ...wechat };
      return software;
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
  async create(url: string,data: SoftwareDto): Promise<Software> {
    const software = this.softwareRepository.create(this.generateSoftware(url, data));
    return await this.softwareRepository.save(software);
  }

  /**
   * 生成项目参数
   * @param data SoftwareDto
   */
  private generateSoftware(url: string, data: SoftwareDto): Software {
    const alipay = {
      app_id: data.alipay_app_id,
      debug: data.alipay_debug,
      private_key: data.alipay_private_key,
      public_key: data.alipay_public_key,
      notify_url: data.alipay_notify_url ? data.alipay_notify_url : `${url}/alipay_notify_url`,
    }
    const wechat = {
      app_id: data.wechat_app_id,
      debug: data.wechat_debug,
      mch_id: data.wechat_mch_id,
      mch_key: data.wechat_mch_key,
      app_secret: data.wechat_app_secret,
      ssl_cer: data.wechat_ssl_cer,
      ssl_key: data.wechat_ssl_key,
      notify_url: data.wechat_notify_url ? data.wechat_notify_url : `${url}/wechat_notify_url`,
    }
    const software: any = {
      name: data.name,
      domain_url: data.domain_url,
      callback_url: data.call_back,
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
  async update(url:string, data: SoftwareDto): Promise<Software> {
    const software = this.softwareRepository.create(this.generateSoftware(url, data));
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
