import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { TimeSlotsService } from './time_slots.service';
import { createtime_dto } from './Dtos/create-time-dto';
import { updateTime_dto } from './Dtos/update-time-dto';
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
  @Patch('/:id')
  async Update_time(@Param('id') id: string, @Body() body: updateTime_dto) {
    return this.timeService.update_time(id, body);
  }
}
