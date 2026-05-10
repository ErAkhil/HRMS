import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import type { JwtPayload } from '../auth/types/jwt-payload.type';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private tasks: TasksService) {}

  @Get('my')
  getMyTasks(@CurrentUser() user: JwtPayload) {
    return this.tasks.getMyTasks(user);
  }

  @Get()
  getOrgTasks(@CurrentUser() user: JwtPayload) {
    return this.tasks.getOrgTasks(user);
  }

  @Get('projects')
  getProjects(@CurrentUser() user: JwtPayload) {
    return this.tasks.getProjects(user);
  }

  @Get('workload')
  getTeamWorkload(@CurrentUser() user: JwtPayload) {
    return this.tasks.getTeamWorkload(user);
  }

  @Post()
  createTask(@Body() dto: CreateTaskDto, @CurrentUser() user: JwtPayload) {
    return this.tasks.createTask(dto, user);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTaskStatusDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.tasks.updateTaskStatus(id, dto.status, user);
  }

  @Post('projects')
  createProject(@Body() dto: CreateProjectDto, @CurrentUser() user: JwtPayload) {
    return this.tasks.createProject(dto, user);
  }
}
