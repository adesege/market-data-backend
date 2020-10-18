import {
  ExecutionContext,
  mixin
} from '@nestjs/common';
import { AuthGuard, IAuthGuard, Type } from '@nestjs/passport';
import { Request } from 'express';
import memoize from 'lodash.memoize';
import { IRoles } from 'src/interfaces/role';
import User from 'src/user/models/user';

function createBaseGuard(role: IRoles) {
  class MixinBaseGuard extends AuthGuard('jwt') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      await super.canActivate(context);
      const request = context.switchToHttp().getRequest<Request>();
      const user = request.user as User;
      return user.roles.includes(role)
    }
  }
  const guard = mixin(MixinBaseGuard);
  return guard;
}

export const BaseGuard: (
  role: IRoles,
) => Type<IAuthGuard> = memoize(createBaseGuard);
