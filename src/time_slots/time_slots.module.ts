import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { time_Schema, timeSlots } from './schema/schema-time';
import { AuthSchema, Auth } from 'src/auth/schema/schema-Auth';
import { TimeSlotsController } from './time_slots.controller';
import { TimeSlotsService } from './time_slots.service';
import { time_Repo } from './time-Repo';
import { AuthService } from 'src/auth/auth.service';
import { Auth_Repo } from 'src/auth/Auth-Repo';
import { check_token } from 'src/Guards/check-Token';
import { check_provider } from 'src/Guards/check-Provider';
import { Auth_validate } from '../Guards/validate-Token';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: timeSlots.modelName, schema: time_Schema },
      { name: Auth.modelName, schema: AuthSchema },
    ]),
    AuthModule,
  ],
  controllers: [TimeSlotsController],
  providers: [
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

  exports: [TimeSlotsService, time_Repo, 'role'],
})
export class TimeSlotsModule {}
