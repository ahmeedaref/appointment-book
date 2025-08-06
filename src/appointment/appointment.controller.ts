import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Req,
  UnauthorizedException,
  Put,
  Delete,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { appointment_Dto } from './Dtos/create-appointment-dto';
import { check_token } from 'src/Guards/check-Token';
import { App_status } from './schema/schema-appointment';
import { updateAppoint_dto } from './Dtos/update-appointment-dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appintmentService: AppointmentService) {}
  @UseGuards(check_token)
  @Post('Booked-App')
  async create_App(@Body() body: appointment_Dto, @Req() req: any) {
    const user = req?.user?.id;
    return this.appintmentService.create_Appointment(body, user);
  }
  @UseGuards(check_token)
  @Get('/:id')
  async Viwe(@Param('id') id: string, @Req() req: any) {
    const user = req?.user?.id;
    if (!user) throw new UnauthorizedException('User not Authorized');
    return this.appintmentService.view_appoint(id, user);
  }
  @Put('/:id')
  @UseGuards(check_token)
  async upadte_app(
    @Param('id') id: string,
    @Body() body: updateAppoint_dto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.appintmentService.update_app(id, userId, body);
  }
  @Delete('/:id')
  @UseGuards(check_token)
  async DelteApp(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    return this.appintmentService.Delete_App(id, userId);
  }
}
