import { Module } from '@nestjs/common';
import { appointment, appointment_Schema } from './schema/schema-appointment';
import { MongooseModule } from '@nestjs/mongoose';
import { timeSlots, time_Schema } from 'src/time_slots/schema/schema-time';
import { Auth, AuthSchema } from 'src/auth/schema/schema-Auth';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { appointment_Repo } from './appointment-Repo';
import { AuthModule } from 'src/auth/auth.module';
import { TimeSlotsModule } from '../time_slots/time_slots.module';
import { TimeSlotsService } from 'src/time_slots/time_slots.service';
import { time_Repo } from 'src/time_slots/time-Repo';
import { AuthService } from 'src/auth/auth.service';
import { Auth_Repo } from 'src/auth/Auth-Repo';
import { check_token } from 'src/Guards/check-Token';
import { check_provider } from 'src/Guards/check-Provider';
import { Auth_validate } from '../Guards/validate-Token';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: appointment.modelName,
        schema: appointment_Schema,
      },
      {
        name: timeSlots.modelName,
        schema: time_Schema,
      },
      { name: Auth.modelName, schema: AuthSchema },
    ]),
    AuthModule,
    TimeSlotsModule,
  ],
  providers: [
    AppointmentService,
    appointment_Repo,
    TimeSlotsService,
    time_Repo,
    AuthService,
    Auth_Repo,
    JwtService,
    Auth_validate,
    check_token,
    check_provider,
    { provide: 'role', useValue: 'provider' },
  ],
  controllers: [AppointmentController],
  exports: [AppointmentService, appointment_Repo, 'role'],
})
export class AppointmentModule {}
