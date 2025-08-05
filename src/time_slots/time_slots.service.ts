import { Injectable, BadRequestException } from '@nestjs/common';
import { time_Repo } from './time-Repo';
import { createtime_dto } from './Dtos/create-time-dto';
import { updateTime_dto } from './Dtos/update-time-dto';
@Injectable()
export class TimeSlotsService {
  constructor(private readonly timeRepo: time_Repo) {}

  async createTime(data: createtime_dto, requestUser: any) {
    const isOverLapp = await this.timeRepo.isOverlapping(data);
    if (isOverLapp) {
      throw new BadRequestException('This time slot overlaps with another.');
    }

    return this.timeRepo.create_time(data, requestUser);
  }

  async get_Time(providerId: string, requestUser: any) {
    return this.timeRepo.getTimes_Provider(providerId, requestUser);
  }

  async update_time(timeId: string, data: updateTime_dto, requestUser: any) {
    return this.timeRepo.updateTime_slots(timeId, data, requestUser);
  }

  async delete_Time(timeId, requestUser: any) {
    return this.timeRepo.Delete_time(timeId, requestUser);
  }
}
