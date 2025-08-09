import { Injectable } from '@nestjs/common';
import { appointment_Repo } from './appointment-Repo';
import { appointment_Dto } from './Dtos/create-appointment-dto';
import { App_status } from './schema/schema-appointment';
import { toEgyptTime, toUTC } from 'src/common/utiels';
@Injectable()
export class AppointmentService {
  constructor(private readonly appointmenRepo: appointment_Repo) {}

  async create_Appointment(data: appointment_Dto, userId: string) {
    return this.appointmenRepo.create_appointment(data, userId);
  }

  async view_appoint(userId: string, requestUser: any) {
    return this.appointmenRepo.ViewAll_appointment(userId, requestUser);
  }

  async update_app(
    providerId: string,
    userId: string,
    statusDto: { status: App_status },
  ) {
    return this.appointmenRepo.update_appoint(providerId, userId, statusDto);
  }

  async GetAppointments_At(from: Date, to: Date) {
    const start = new Date(from);
    const end = new Date(to);
    start.setSeconds(0, 0);
    end.setSeconds(59, 999);
    const startUTC = toUTC(start);
    const endUTC = toUTC(end);

    return this.appointmenRepo.findAppointmentAtDateRange(startUTC, endUTC);
  }
}
