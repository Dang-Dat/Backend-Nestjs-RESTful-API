import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from './test.guard';
import { Public, ResponseMessage, User } from 'src/decorator/customeiz';
import { IUser } from './user.interface';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  //req.body
  @ResponseMessage("Create a new User")
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    let newUser = await this.usersService.create(createUserDto, user);
    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt
    }

  }
  @Public()
  @ResponseMessage("Fetch user with paginate")
  @Get()
  async findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,) {
    return await this.usersService.findAll(+currentPage, +limit, qs);
  }

  @Public()
  @ResponseMessage("Fetch user by id")
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const foundUser = await this.usersService.findOne(id);
    return foundUser
  }

  @ResponseMessage("Updated a User")
  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    console.log(updateUserDto.role)
    let updateUser = await this.usersService.update(updateUserDto, user);
    return {
      updateUser
    }
  }

  @ResponseMessage("Deleted a User")
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }
}
