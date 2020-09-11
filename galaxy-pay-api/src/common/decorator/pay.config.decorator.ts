import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const PayConfig = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.payConfig;
    },
);  