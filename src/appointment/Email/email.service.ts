import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendRemainder(to: string, appointmentDate: Date) {
    const formattedDate = appointmentDate.toLocaleString();
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to,
      subject: 'Appointment Reminder',
      text: `Hi this is a remainder that ypu have appointment schedule at${formattedDate}`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`Reminder email sent to ${to}: ${info.messageId}`);
    } catch (err) {
      console.error(`Faild to senda Remainder to ${to}:`, err.message);
    }
  }
}
