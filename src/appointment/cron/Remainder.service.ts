import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AppointmentService } from '../appointment.service';
import { EmailService } from '../Email/email.service';
import { toUTC, toEgyptTime } from 'src/common/utiels';
@Injectable()
export class ReminderCronService {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly emailService: EmailService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const now = new Date();
    const start = new Date(now.getTime() + 5 * 60 * 1000);
    const end = new Date(start.getTime() + 59 * 1000);
    const appointments = await this.appointmentService.GetAppointments_At(
      start,
      end,
    );
    console.log('Now:', now.toISOString());
    console.log('Start:', start.toISOString());
    console.log('End:', end.toISOString());
    console.log('Appointments found:', appointments.length);

    for (const appointment of appointments) {
      const userEmail = (appointment.BookedBy as any)?.email;
      await this.emailService.sendRemainder(
        userEmail,
        toEgyptTime(new Date(appointment.Date)),
      );
    }
  }
}
