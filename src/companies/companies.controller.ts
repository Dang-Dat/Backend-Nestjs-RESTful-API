import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customeiz';
import { IUser } from 'src/users/user.interface';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { }

  @Post()
  @ResponseMessage('Create new company')
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @User() user: IUser) {

    return this.companiesService.create(createCompanyDto, user);
  }

  @Public()
  @ResponseMessage('Fetch list companies with paginate')
  @Get()
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,
  ) {
    return this.companiesService.findAll(+currentPage, +limit, qs);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch()
  update(
    @Body() updateCompanyDto: UpdateCompanyDto, @User() user: IUser) {
    if (updateCompanyDto && updateCompanyDto._id) {
      return this.companiesService.update(updateCompanyDto, user);
    }
    else {
      return "update khong thanh cong"
    }

  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @User() user: IUser) {
    return this.companiesService.remove(id, user);
  }
}
