import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * 通过装饰器获取ctx中得支付配置
 */
export const PayConfig = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.payConfig;
});
