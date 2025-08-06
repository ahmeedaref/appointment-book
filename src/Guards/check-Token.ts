import {
  Injectable,
  UnauthorizedException,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Auth_validate } from './validate-Token';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class check_token implements CanActivate {
  constructor(private authValidate: Auth_validate) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest() as Request & {
      user?: any;
    };

    const token = request.headers['authorization'];
    if (!token) {
      throw new UnauthorizedException('Token Not found');
    }
    try {
      const decode = this.authValidate.validateToken(token);
      request.user = decode;
      return true;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
