import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Mongoose } from 'mongoose';
import { createtime_dto } from './Dtos/create-time-dto';
import { time_Document } from './schema/schema-time';
import mongoose from 'mongoose';
import { updateTime_dto } from './Dtos/update-time-dto';
@Injectable()
export class time_Repo {
  constructor(
    @InjectModel('timeSlots') private readonly timeModel: Model<time_Document>,
  ) {}
  async isOverlapping(data: createtime_dto) {
    const { providerId, Date, startTime, endTime } = data;
    const overLapp = await this.timeModel.findOne({
      providerId,
      Date,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        },
      ],
    });
    return !!overLapp;
  }

  async create_time(data: createtime_dto) {
    const time = new this.timeModel(data);
    return time.save();
  }

  async getTimes_Provider(providerId: string) {
    const time = await this.timeModel.find({
      providerId: new mongoose.Types.ObjectId(providerId),
    });

    if (!time) {
      throw new NotFoundException('No time slots found');
    }

    return time;
  }

  async updateTime_slots(timeId: string, data: updateTime_dto) {
    const existingSlot = await this.timeModel.findById(timeId);

    if (!existingSlot) {
      throw new NotFoundException('Time slot not found');
    }

    const providerId = existingSlot.providerId;

    if (data.startTime || data.endTime || data.Date) {
      const isOverlapping = await this.timeModel.findOne({
        providerId: providerId,
        Date: data.Date,
        _id: { $ne: timeId },
        $or: [
          {
            startTime: { $lt: data.endTime },
            endTime: { $gt: data.startTime },
          },
        ],
      });

      if (isOverlapping) {
        throw new BadRequestException(
          'This time slot overlaps with an existing one',
        );
      }
    }
    const updateSlot = await this.timeModel.findByIdAndUpdate(
      timeId,
      { $set: data },
      {
        new: true,
      },
    );

    return { message: 'updated successfully', updateSlot };
  }
}
