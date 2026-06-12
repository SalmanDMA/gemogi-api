import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  override handleRequest<TUser = unknown>(
    err: unknown,
    user: TUser | null | undefined,
  ): TUser {
    if (err || !user) {
      if (err instanceof Error) {
        throw err;
      }
      throw new UnauthorizedException(
        typeof err === 'string' ? err : 'Invalid refresh token',
      );
    }
    return user;
  }
}
