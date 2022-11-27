import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { User } from './models/users.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: User) {
    return this.usersService.create(createUserDto);
  }

  @Get('login/:userName')
  login(@Param('userName') userName: string) {
    return this.usersService.login(userName);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':userName')
  findOne(@Param('userName') userName: string) {
    return this.usersService.findOne(userName);
  }

  @Get('userName/:userName')
  findOneByUserName(@Param('userName') userName: string) {
    return this.usersService.findOneByUserName(userName);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
