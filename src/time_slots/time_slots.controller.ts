import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TimeSlotsService } from './time_slots.service';
import { createtime_dto } from './Dtos/create-time-dto';
@Controller('time-slots')
export class TimeSlotsController {
  constructor(private readonly timeService: TimeSlotsService) {}
  @Post('create-timeSlots')
  async createTime_slot(@Body() body: createtime_dto) {
    return this.timeService.createTime(body);
  }

  @Get('/:id')
  async Get_times(@Param('id') id: string) {
    return this.timeService.get_Time(id);
  }
}
