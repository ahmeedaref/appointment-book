import { IsString, IsEmail } from 'class-validator';
export class SignUp_Dto {
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsString()
  role?: string;
}
