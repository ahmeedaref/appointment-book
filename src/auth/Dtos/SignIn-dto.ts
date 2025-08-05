import { PartialType } from '@nestjs/mapped-types';
import { SignUp_Dto } from './SignUp_dto';

export class SignIn_Dto extends PartialType(SignUp_Dto) {}
