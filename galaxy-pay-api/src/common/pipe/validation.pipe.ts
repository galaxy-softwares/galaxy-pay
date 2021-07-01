import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  UnprocessableEntityException,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { validate } from 'class-validator'
import { plainToClass } from 'class-transformer'

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value, metadata: ArgumentMetadata) {
    const { metatype } = metadata

    if (value instanceof Object && Object.keys(value).length <= 0) {
      throw new UnprocessableEntityException('无效数据')
    }

    if (!metatype || !this.toValidate(metatype)) {
      return value
    }

    const object = plainToClass(metatype, value)
    const errors = await validate(object, {})

    if (errors.length > 0) {
      const error = errors.shift()
      const constraints = error.constraints
      Object.keys(constraints).forEach(key => {
        throw new HttpException(constraints[key], HttpStatus.FORBIDDEN)
      })
    }
    return object
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object]
    return !types.find(type => metatype === type)
  }
}
