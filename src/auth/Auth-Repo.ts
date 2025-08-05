import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthDocument } from './schema/schema-Auth';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { SignUp_Dto } from './Dtos/SignUp_dto';
import { SignIn_Dto } from './Dtos/SignIn-dto';
Injectable();
export class Auth_Repo {
  constructor(
    @InjectModel('Auth') private readonly AuthModel: Model<AuthDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async SignUp(data: SignUp_Dto) {
    try {
      const { email } = data;
      const user = await this.AuthModel.findOne({ email });
      if (user) {
        throw new BadRequestException('Email is already exsit');
      }
      const passHash = await bcrypt.hash(data.password, 10);
      data.password = passHash;
      const User = new this.AuthModel(data);
      return User.save();
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async SignIn(data: SignIn_Dto) {
    const { email } = data;
    const user = await this.AuthModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('Wrong email');
    }
    const passCompare = await bcrypt.compare(data.password, user.password);
    if (!passCompare) {
      throw new BadRequestException('Wrong password');
    }
    const payload = {
      id: user.id,
      name: user.name,
      role: user.role,
    };
    const accesstoken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('ACCESSTOKEN'),
      expiresIn: '1h',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESHTOKEN'),
      expiresIn: '30m',
    });

    return { message: 'Logged Successfuly', accesstoken, refreshToken };
  }

  async Refresh_token(refresh: string) {
    try {
      const decode = this.jwtService.verify(refresh, {
        secret: this.configService.get<string>('REFRESHTOKEN'),
      });
      const payload = {
        id: decode.id,
        name: decode.name,
        role: decode.role,
      };
      const newAccesstoken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('ACCESSTOKEN'),
        expiresIn: '1h',
      });
      return { accesstoken: newAccesstoken };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
