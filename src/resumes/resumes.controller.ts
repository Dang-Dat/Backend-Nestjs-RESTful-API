import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto, CreateUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResponseMessage, User } from 'src/decorator/customeiz';
import { IUser } from 'src/users/user.interface';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) { }

  @ResponseMessage('Create new resume')
  @Post()
  create(@Body() createUserCvDto: CreateUserCvDto, @User() user: IUser) {

    return this.resumesService.create(createUserCvDto, user);
  }
  @ResponseMessage('Fetch list resume with paginate')
  @Get()
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,
  ) {
    return this.resumesService.findAll(+currentPage, +limit, qs);
  }

  @Post('by-user')
  @ResponseMessage('Get resume by user')
  getResumeByUser(@User() user: IUser) {
    return this.resumesService.findByUsers(user)
  }

  @ResponseMessage('Fetch resume by id')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @ResponseMessage('Update status resume')
  @Patch(':id')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @User() user: IUser
  ) {
    return this.resumesService.update(id, status, user);
  }

  @ResponseMessage('Delete resume')
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resumesService.remove(id, user);
  }
}
