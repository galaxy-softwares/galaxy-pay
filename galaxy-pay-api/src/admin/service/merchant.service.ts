import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { MerchantDto } from '../dtos/merchant.dto'
import { Merchant } from '../entities/merchant.entity'
import { BaseService } from './base.service'

@Injectable()
export class MerchantService extends BaseService<Merchant> {
  constructor(
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>
  ) {
    super(merchantRepository)
  }

  find() {
    return this.merchantRepository.find()
  }

  /**
   *
   * @param id
   */
  async findOne(id: number) {
    return await this.merchantRepository.findOne(id)
  }

  async createMerchant(data: MerchantDto): Promise<any> {
    const merchant = this.merchantRepository.create(data)
    return await this.merchantRepository.save(merchant)
  }

  async updateMerchant(data: MerchantDto): Promise<Merchant> {
    const merchant = this.merchantRepository.create(data)
    return await this.merchantRepository.save(merchant)
  }
}
