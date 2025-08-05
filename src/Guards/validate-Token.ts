import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Auth_validate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  validateToken(token: string) {
    try {
      const secretKey = this.configService.get<string>('ACCESSTOKEN');
      if (!secretKey) {
        throw new UnauthorizedException('No secret key Found for verification');
      }
      const accesstoken = this.jwtService.verify(token, { secret: secretKey });
      return accesstoken;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
