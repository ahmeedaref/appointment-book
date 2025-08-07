import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TimeSlotsService } from './time_slots.service';
import { createtime_dto } from './Dtos/create-time-dto';
import { updateTime_dto } from './Dtos/update-time-dto';
import { check_provider } from 'src/Guards/check-Provider';
import { check_token } from 'src/Guards/check-Token';
@Controller('time-slots')
export class TimeSlotsController {
  constructor(private readonly timeService: TimeSlotsService) {}
  @UseGuards(check_provider)
  @Post('create-timeSlots')
  async createTime_slot(@Body() body: createtime_dto, @Req() req: any) {
    const user = req.user;
    return this.timeService.createTime(body, user);
  }
  @UseGuards(check_token)
  @Get('search')
  async search_Q(@Query() query: any) {
    return this.timeService.search_query(query);
  }

  @UseGuards(check_token)
  @Get()
  async view_Times() {
    return this.timeService.view_Times();
  }

  @UseGuards(check_provider)
  @Get('/:id')
  async Get_times(@Param('id') id: string, @Req() req: any) {
    const user = req.user;
    return this.timeService.get_Time(id, user);
  }
  @UseGuards(check_provider)
  @Patch('/:id')
  async Update_time(
    @Param('id') id: string,
    @Body() body: updateTime_dto,
    @Req() req: any,
  ) {
    const user = req.user;
    return this.timeService.update_time(id, body, user);
  }
  @UseGuards(check_provider)
  @Delete('/:id')
  async Delete_time(@Param('id') timeId: string, @Req() req: any) {
    const time = this.timeService.delete_Time(timeId, req.user);
    return time;
  }
}
