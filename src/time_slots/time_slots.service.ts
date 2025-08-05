import { Injectable, BadRequestException } from '@nestjs/common';
import { time_Repo } from './time-Repo';
import { createtime_dto } from './Dtos/create-time-dto';

@Injectable()
export class TimeSlotsService {
  constructor(private readonly timeRepo: time_Repo) {}

  async createTime(data: createtime_dto) {
    const isOverLapp = await this.timeRepo.isOverlapping(data);
    if (isOverLapp) {
      throw new BadRequestException('This time slot overlaps with another.');
    }

    return this.timeRepo.create_time(data);
  }

  async get_Time(providerId: string) {
   
    return this.timeRepo.getTimes_Provider(providerId);
  }
}
