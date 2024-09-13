import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorator/roles.decorator';
import * as process from 'node:process';

@Injectable()
export class RefreshGuard implements  CanActivate{
  constructor(private jwtService: JwtService, private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    console.log(request);
    console.log(token);
    if (!token) {
      throw new UnauthorizedException("Veuillez vous connecter pour accéder aux ressources.");
    }
    try {
      request['user'] = await this.jwtService.verify(token, {
        secret: process.env.REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException("Votre jeton d'accès a expiré.");
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Refresh' ? token : undefined;
  }
}