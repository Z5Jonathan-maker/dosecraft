import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtPayload {
  readonly sub: string;
  readonly email: string;
  readonly role: string;
}

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext): JwtPayload | string => {
    const request = ctx.switchToHttp().getRequest();
    const user: JwtPayload = request.user;
    return data ? user[data] : user;
  },
);
