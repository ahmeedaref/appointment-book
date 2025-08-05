import {
  Injectable,
  Inject,
  UnauthorizedException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Auth_validate } from './validate-Token';
import { Observable } from 'rxjs';

@Injectable()
export class check_provider implements CanActivate {
  constructor(private authValidate: Auth_validate) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];
    const decode = this.authValidate.validateToken(token);
    const role = decode.role;
    if (role !== 'provider') {
      throw new UnauthorizedException('access denied');
    }
    request.user = decode;
    return true;
  }
}
