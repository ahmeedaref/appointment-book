import {
  IsString,
  IsMongoId,
  IsNotEmpty,
  IsBoolean,
  IsDateString,
} from 'class-validator';
export class createtime_dto {
  @IsMongoId()
  @IsNotEmpty()
  providerId: string;
  @IsDateString()
  Date: Date;
  @IsString()
  duration: string;
  @IsString()
  startTime: string;
  @IsString()
  endTime: string;
  @IsBoolean()
  isBooked?: boolean;
}
