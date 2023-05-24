import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcrypt';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
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

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: any) {
    // Revisamos si la contraseña es la misma
    const { password } = updateUserDto;
    if (password) {
      const plainToHash = await hash(password, 10);
      updateUserDto = { ...updateUserDto, password: plainToHash };
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
