import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { appointment_Dto } from './Dtos/create-appointment-dto';
import { App_status, appointment_Document } from './schema/schema-appointment';
import { Types } from 'mongoose';
@Injectable()
export class appointment_Repo {
  constructor(
    @InjectModel('appointment')
    private readonly appointModel: Model<appointment_Document>,
  ) {}

  async create_appointment(data: appointment_Dto, userId: string) {
    const alreadyBooked = await this.appointModel.findOne({
      createdBy: new Types.ObjectId(data.createdBy),
      status: App_status.Booked,
    });
    if (alreadyBooked) {
      throw new ConflictException('this time slot already Booked');
    }
    const newAppointment = new this.appointModel({
      createdBy: data.createdBy,
      BookedBy: userId,
      status: App_status.Booked,
    });

    const timeSlot = await newAppointment.populate<{ createdBy: any }>(
      'createdBy',
    );
    if (!timeSlot.createdBy) {
      throw new NotFoundException('Time slot not found');
    }

    newAppointment.Date = timeSlot.createdBy.Date;
    newAppointment.duration = timeSlot.createdBy.duration;
    newAppointment.providerId = timeSlot.createdBy.providerId;
    return newAppointment.save();
  }
}
