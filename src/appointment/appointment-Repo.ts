import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { appointment_Dto } from './Dtos/create-appointment-dto';
import { App_status, appointment_Document } from './schema/schema-appointment';
import { time_Document } from 'src/time_slots/schema/schema-time';
import { updateTime_dto } from 'src/time_slots/Dtos/update-time-dto';

@Injectable()
export class appointment_Repo {
  constructor(
    @InjectModel('appointment')
    private readonly appointModel: Model<appointment_Document>,
    @InjectModel('timeSlots') private readonly timeModel: Model<time_Document>,
  ) {}

  async create_appointment(data: appointment_Dto, userId: string) {
    const timeSlot = await this.timeModel.findById(data.createdBy);
    if (!timeSlot) {
      throw new NotFoundException('Time slot not found');
    }

    if (timeSlot.isBooked) {
      throw new ConflictException('This time slot is already booked');
    }

    timeSlot.isBooked = true;
    await timeSlot.save();

    const newAppointment = new this.appointModel({
      createdBy: timeSlot._id,
      BookedBy: userId,
      status: App_status.Booked,
      Date: timeSlot.Date,
      duration: timeSlot.duration,
      startTime: timeSlot.startTime,
      endTime: timeSlot.endTime,
      providerId: timeSlot.providerId,
    });

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
      .populate<{ createdBy: any }>('createdBy');
    if (!appoint) {
      throw new NotFoundException('No time slot appointmented');
    }
    return appoint;
  }

  async update_appoint(
    appointmentId: string,
    userId: string,
    statusDto: { status: App_status },
  ) {
    const { status } = statusDto;
    const appointment = await this.appointModel
      .findById(appointmentId)
      .populate<{ createdBy: any }>('createdBy');

    if (!appointment) {
      throw new NotFoundException('No appointment found');
    }

    if (appointment.BookedBy.toString() !== userId) {
      throw new UnauthorizedException('you can not update other appointment');
    }

    if (appointment.status !== App_status.Booked) {
      throw new BadRequestException(
        'Only booked appointments can be cancelled',
      );
    }

    appointment.status = status;

    if (appointment.createdBy) {
      appointment.createdBy.isBooked = false;
      await appointment.createdBy.save();
    }

    return await appointment.save();
  }

  async Delete_app(id: string, userId: string) {
    const DeleteApp = await this.appointModel
      .findById(id)
      .populate<{ createdBy: any }>('createdBy');

    if (!DeleteApp) {
      throw new NotFoundException('No Appointment Found');
    }
    if (DeleteApp.BookedBy.toString() !== userId) {
      throw new UnauthorizedException(
        'Not Allowed to Delete other Appointment',
      );
    }

    DeleteApp.createdBy.isBooked = false;
    await DeleteApp.save();

    await this.appointModel.findByIdAndDelete(id);
    return { message: 'Deleted Appointment Successfully' };
  }
}
