import { Module } from '@nestjs/common';
import { appointment, appointment_Schema } from './schema/schema-appointment';
import { MongooseModule } from '@nestjs/mongoose';
import { timeSlots, time_Schema } from 'src/time_slots/schema/schema-time';
import { Auth, AuthSchema } from 'src/auth/schema/schema-Auth';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
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
  ],
  providers: [AppointmentService],
  controllers: [AppointmentController],
})
export class AppointmentModule {}
