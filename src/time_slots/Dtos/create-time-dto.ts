import { IsString, IsMongoId, IsNotEmpty, IsBoolean } from 'class-validator';
export class createtime_dto {
  @IsMongoId()
  @IsNotEmpty()
  providerId: string;
  @IsString()
  Date: string;
  @IsString()
  duration: string;
  @IsString()
  startTime: string;
  @IsString()
  endTime: string;
  @IsBoolean()
  isBooked?: boolean;
}
