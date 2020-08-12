import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiException extends HttpException {

  private errorMessage: string;
  private errorCode: any;

  constructor(errorMessage: string, errorCode: any, code: HttpStatus) {

    super({
      code: code,
      message: errorMessage,
      data: null
    }, code);

    this.errorMessage = errorMessage;
    this.errorCode = errorCode;
  }

  getErrorCode(): any {
    return this.errorCode;
  }

  getErrorMessage(): string {
    return this.errorMessage;
  }
}
