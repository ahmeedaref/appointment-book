import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createtime_dto } from './Dtos/create-time-dto';
import { time_Document } from './schema/schema-time';
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
}
