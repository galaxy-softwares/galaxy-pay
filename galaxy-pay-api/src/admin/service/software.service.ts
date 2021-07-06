import { Injectable } from '@nestjs/common'
import { BaseService } from './base.service'
import { Software } from 'src/admin/entities/software.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SoftwareDto } from '../dtos/base.dto'

@Injectable()
export class SoftwareService extends BaseService<Software> {
  constructor(
    @InjectRepository(Software)
    private readonly softwareRepository: Repository<Software>
  ) {
    super(softwareRepository)
  }

  /**
   * 查询项目（因为不会有太多的项目索性不做分页查询!）
   */
  find() {
    return this.softwareRepository.find()
  }

  /**
   * 创建应用
   * @param data SoftwareDto
   */
  async createSoftware(data: SoftwareDto): Promise<Software> {
    const software = this.softwareRepository.create(data)
    return await this.softwareRepository.save(software)
  }
}
