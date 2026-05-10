import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Controller('meetings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MeetingsController {
  constructor(private meetings: MeetingsService) {}

  @Get()
  getMeetings(@CurrentUser() user: JwtPayload) {
    return this.meetings.getMeetings(user);
  }

  @Get('employees')
  getMeetingEmployees(@CurrentUser() user: JwtPayload) {
    return this.meetings.getMeetingEmployees(user);
  }

  @Post()
  createMeeting(@Body() dto: CreateMeetingDto, @CurrentUser() user: JwtPayload) {
    return this.meetings.createMeeting(dto, user);
  }
}
