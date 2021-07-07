import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { BaseService } from './base.service'
import { Software } from 'src/admin/entities/software.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SoftwareDto } from '../dtos/base.dto'
import { PayappService } from './payapp.service'

@Injectable()
export class SoftwareService extends BaseService<Software> {
  constructor(
    @InjectRepository(Software)
    private readonly softwareRepository: Repository<Software>,
    private payappService: PayappService
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
  async createSoftware(software: SoftwareDto): Promise<Software> {
    return await this.softwareRepository.save(software)
  }

  async delete(id: number) {
    const payapp = await this.payappService.findOneByWhere({ software_id: id })
    if (payapp) {
      throw new HttpException(`该项目已经被使用，无法删除！`, HttpStatus.BAD_REQUEST)
    } else {
      return await this.softwareRepository.delete({ id })
    }
  }
}
