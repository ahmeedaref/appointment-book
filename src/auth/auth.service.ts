import { Injectable } from '@nestjs/common';
import { Auth_Repo } from './Auth-Repo';
import { SignUp_Dto } from './Dtos/SignUp_dto';
import { SignIn_Dto } from './Dtos/SignIn-dto';
@Injectable()
export class AuthService {
  constructor(private readonly AuthRepo: Auth_Repo) {}

  async register(data: SignUp_Dto) {
    return this.AuthRepo.SignUp(data);
  }
  async Login(data: SignIn_Dto) {
    return this.AuthRepo.SignIn(data);
  }

  async Refresh(refresh: string) {
    return this.AuthRepo.Refresh_token(refresh);
  }
}
