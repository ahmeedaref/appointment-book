import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { appointment_Dto } from './Dtos/create-appointment-dto';
import { check_token } from 'src/Guards/check-Token';
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appintmentService: AppointmentService) {}
  @UseGuards(check_token)
  @Post('Booked-App')
  async create_App(@Body() body: appointment_Dto, @Req() req: any) {
    const userId = req?.user?.id;
    if (!userId) throw new UnauthorizedException('User not authenticated');
    return this.appintmentService.create_Appointment(body, userId);
  }
}
