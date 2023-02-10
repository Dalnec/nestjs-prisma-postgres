import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    if (data) {
      console.log('request.user[data]', request.user[data]);
      return request.user[data];
    }
    console.log('request.user', request.user);
    return request.user;
  },
);