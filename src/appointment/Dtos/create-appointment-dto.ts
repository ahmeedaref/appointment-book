import { IsMongoId, IsNotEmpty } from 'class-validator';

export class appointment_Dto {
  @IsMongoId()
  @IsNotEmpty()
  createdBy: string;
}
