import { Repository } from 'typeorm';

export abstract class BaseService<T> {
    constructor(protected repository: Repository<T>) {}
    async findOneById(id: string) {
        return await this.repository.findOne(id);
    }

    async remove(ids: string[]) {
        return await this.repository.remove(await this.repository.findByIds(ids));
    }

    async findUserByWhere(where) {
        return await this.repository.findOne(where);
    }

}