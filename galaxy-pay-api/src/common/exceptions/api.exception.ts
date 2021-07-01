import { HttpException, HttpStatus } from '@nestjs/common'

export class ApiException extends HttpException {
  private errorMessage: string
  private errorCode: number

  constructor(errorMessage: string, errorCode: number, code: HttpStatus) {
    super(
      {
        code: code,
        message: errorMessage,
        data: null
      },
      code
    )

    this.errorMessage = errorMessage
    this.errorCode = errorCode
  }

  getErrorCode(): number {
    return this.errorCode
  }

  getErrorMessage(): string {
    return this.errorMessage
  }
}
