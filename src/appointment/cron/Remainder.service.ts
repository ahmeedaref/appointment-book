import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { addMinutes } from 'date-fns';
import { AppointmentService } from '../appointment.service';
import { EmailService } from '../Email/email.service';
@Injectable()
export class ReminderCronService {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly emailService: EmailService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const now = new Date();
    const target = addMinutes(now, 30);

    const appointments =
      await this.appointmentService.GetAppointments_At(target);

    for (const appointment of appointments) {
      const userEmail = (appointment.BookedBy as any)?.email;
      await this.emailService.sendRemainder(
        userEmail,
        new Date(appointment.Date),
      );
    }
  }
}
