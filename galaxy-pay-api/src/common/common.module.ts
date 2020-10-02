import { Module, Global } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ResponseInterceptor } from './interceptor/response.interceptor';
import { ValidationPipe } from './pipe/validation.pipe';

@Global()
@Module({
    providers: [
        {
            provide: APP_PIPE,
            useClass: ValidationPipe,
        },
        // {
        //     provide: APP_INTERCEPTOR,
        //     useClass: ResponseInterceptor,
        // },
    ],
})
export class CommonModule {}