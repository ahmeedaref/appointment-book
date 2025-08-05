import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { time_Schema, timeSlots } from './schema/schema-time';
import { AuthSchema, Auth } from 'src/auth/schema/schema-Auth';
import { TimeSlotsController } from './time_slots.controller';
import { TimeSlotsService } from './time_slots.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: timeSlots.modelName, schema: time_Schema },
      { name: Auth.modelName, schema: AuthSchema },
    ]),
  ],
  controllers: [TimeSlotsController],
  providers: [TimeSlotsService],
})
export class TimeSlotsModule {}
