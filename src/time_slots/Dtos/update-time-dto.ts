import { PartialType } from '@nestjs/mapped-types';
import { createtime_dto } from './create-time-dto';
export class updateTime_dto extends PartialType(createtime_dto) {}
