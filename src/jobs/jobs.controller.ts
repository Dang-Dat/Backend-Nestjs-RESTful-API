import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customeiz';
import { IUser } from 'src/users/user.interface';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @ResponseMessage("Create a new Job")
  @Post()
  create(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
    // let newJob = await this.jobsService.create(createJobDto, user);
    return this.jobsService.create(createJobDto, user)
  }

  @Public()
  @ResponseMessage('Fetch list jobs with paginate')
  @Get()
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,
  ) {
    return this.jobsService.findAll(+currentPage, +limit, qs);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @ResponseMessage('Updated job')
  @Patch(':id')
  update(@Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @User() user: IUser
  ) {

    if (updateJobDto && updateJobDto._id) {
      return this.jobsService.update(id, updateJobDto, user);
    } else {
      return "update khong thanh cong"
    }

  }

  @ResponseMessage('Deleted job')
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.jobsService.remove(id, user);
  }
}
