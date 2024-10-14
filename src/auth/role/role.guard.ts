import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { Observable } from 'rxjs';
import { SetMetadata } from '@nestjs/common';

export const rolesKey = 'Role';
export const Roles = (...roles: UserRole[]) => SetMetadata(rolesKey, roles);

export const matchUserRoles = (
  requiredRoles: UserRole[],
  userRoles: UserRole[],
) => {
  return requiredRoles.some((role) => userRoles?.includes(role));
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      rolesKey,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return matchUserRoles(requiredRoles, user.userRoles);
  }
}
