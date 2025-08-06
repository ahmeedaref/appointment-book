import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { TimeSlotsController } from './time_slots/time_slots.controller';
import { TimeSlotsService } from './time_slots/time_slots.service';
import { TimeSlotsModule } from './time_slots/time_slots.module';
import { Auth_validate } from './Guards/validate-Token';
import { JwtService } from '@nestjs/jwt';
import { AppointmentController } from './appointment/appointment.controller';
import { AppointmentService } from './appointment/appointment.service';
import { AppointmentModule } from './appointment/appointment.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailService } from './appointment/Email/email.service';
import { ReminderCronService } from './appointment/cron/Remainder.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');
        return { uri };
      },
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    TimeSlotsModule,
    AppointmentModule,
  ],
  controllers: [
    AppController,
    AuthController,
    TimeSlotsController,
    AppointmentController,
  ],
  providers: [
    AppService,
    AuthService,
    TimeSlotsService,
    Auth_validate,
    JwtService,
    AppointmentService,
    EmailService,
    ReminderCronService,
  ],
})
export class AppModule {}
