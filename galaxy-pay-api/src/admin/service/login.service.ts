import { Injectable } from '@nestjs/common';

@Injectable()
export class LoginService {

  getHello(): string {
    return 'Hello World!';
  }
}
