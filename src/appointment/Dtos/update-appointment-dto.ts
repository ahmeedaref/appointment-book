import { IsEnum } from 'class-validator';
import { App_status } from '../schema/schema-appointment';
export class updateAppoint_dto {
  @IsEnum([App_status.Cancalled], {
    message: 'you only can update the appointment to cancel',
  })
  status: App_status.Cancalled;
}
