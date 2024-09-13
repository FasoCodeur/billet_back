import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { UserRole } from '../../user/entities/user-role.enum';
@Injectable()
export class RolesGuards implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
  if ( !requiredRoles.some((role) => user.roles?.includes(role))) {
    throw new UnauthorizedException("Vous n'avez pas les rôles nécessaires pour accéder à cette ressource.");
  }
    return true
  }
}