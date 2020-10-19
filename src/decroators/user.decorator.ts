import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import User from 'src/user/models/user';

export const UserDecorator = createParamDecorator(
  (data: string, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.user[data] : request.user || {};
  },
);
