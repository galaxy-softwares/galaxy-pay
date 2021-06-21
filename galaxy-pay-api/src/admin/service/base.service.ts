import { Repository } from 'typeorm'

export abstract class BaseService<T> {
  constructor(protected repository: Repository<T>) {}
  async findOneById(id: string): Promise<T> {
    return await this.repository.findOne(id)
  }

  async remove(ids: string[]) {
    return await this.repository.remove(await this.repository.findByIds(ids))
  }

  async findUserByWhere(where): Promise<T> {
    return await this.repository.findOne(where)
  }

  async findOneByWhere(where: any): Promise<T> {
    return await this.repository.findOne(where)
  }

  async create(data: T): Promise<T> {
    return await this.repository.save(data)
  }
}
