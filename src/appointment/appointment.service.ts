import { Injectable } from '@nestjs/common';
import { appointment_Repo } from './appointment-Repo';
import { appointment_Dto } from './Dtos/create-appointment-dto';

@Injectable()
export class AppointmentService {
  constructor(private readonly appointmenRepo: appointment_Repo) {}

  async create_Appointment(data: appointment_Dto, userId: string) {
    return this.appointmenRepo.create_appointment(data, userId);
  }

  async view_appoint(userId: string, requestUser: any) {
    return this.appointmenRepo.ViewAll_appointment(userId, requestUser);
  }
}
