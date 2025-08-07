import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
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

  async create_time(data: createtime_dto, requestUser: any) {
    const { providerId } = data;
    if (!requestUser) {
      throw new UnauthorizedException('User Not authorized');
    }
    if (requestUser.id !== providerId) {
      throw new UnauthorizedException(
        'Not Allowed to create time slots to other',
      );
    }
    const time = new this.timeModel(data);
    return time.save();
  }

  async search_Query(query: any): Promise<time_Document[]> {
    const providerName = query.name;
    const slots = await this.timeModel
      .find()
      .populate({
        path: 'providerId',
        match: providerName
          ? { name: { $regex: providerName, $options: 'i' } }
          : {},
        select: 'name',
      })
      .exec();

    return slots.filter((slot) => slot.providerId !== null);
  }

  async GetAll_times() {
    return this.timeModel.find();
  }

  async getTimes_Provider(
    Id: string,
    requestUser: any,
  ): Promise<time_Document[]> {
    if (!requestUser) {
      throw new UnauthorizedException('User Not authorized');
    }
    if (requestUser.id !== Id) {
      throw new UnauthorizedException(
        'You are not allowed to Viwe other timeSlots',
      );
    }
    const time = await this.timeModel.find({
      providerId: new mongoose.Types.ObjectId(Id),
    });

    if (!time) {
      throw new NotFoundException('No time slots found');
    }

    return time;
  }

  async updateTime_slots(
    timeId: string,
    data: updateTime_dto,
    requestUser: any,
  ) {
    const time = await this.timeModel.findById(timeId);

    if (!time) {
      throw new NotFoundException('Time slot not found');
    }
    if (!requestUser) {
      throw new UnauthorizedException('User Not authorized');
    }
    if (requestUser.id !== time.providerId.toString()) {
      throw new UnauthorizedException(
        'You are not allowed to Update other timeSlots',
      );
    }

    const providerId = time.providerId;

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

  async Delete_time(id: string, requestUser: any) {
    const time = await this.timeModel.findById(id);
    if (!time) {
      throw new NotFoundException('Not found time slot');
    }
    if (!requestUser) {
      throw new UnauthorizedException('User Not authorized');
    }
    if (requestUser.id !== time.providerId.toString()) {
      throw new UnauthorizedException(
        'You are not allowed to Delete other timeSlots',
      );
    }

    await this.timeModel.findByIdAndDelete(id);
    return { message: 'Deleted successfully' };
  }
}
