import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { appointment_Dto } from './Dtos/create-appointment-dto';
import { App_status, appointment_Document } from './schema/schema-appointment';
import { Types } from 'mongoose';
import { time_Document } from 'src/time_slots/schema/schema-time';
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

  async ViewAll_appointment(
    userId: string,
    requestUser: any,
  ): Promise<appointment_Document[]> {
    if (!requestUser) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (requestUser !== userId) {
      throw new UnauthorizedException(
        'You are not allowed to view these appointment',
      );
    }
    const appoint = await this.appointModel
      .find({
        BookedBy: new mongoose.Types.ObjectId(userId),
      })
      .populate('createdBy');
    if (!appoint) {
      throw new NotFoundException('No time slot appointmented');
    }
    return appoint;
  }
}
