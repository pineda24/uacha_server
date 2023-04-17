import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel('User')
    private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = new this.userModel(createUserDto);
      return await user.save();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async login(userName: string) {
    try {
      return await this.userModel.findOne({userName: userName}, {_id: 0, userName: 1, password: 1});
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findAll() {
    try {
      return await this.userModel.find({});
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findOne(userName: string) {
    try {
      return await this.userModel.findOne({userName: userName});
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findOneByUserName(userName: string) {
    try {
      return await this.userModel.findOne({userName: userName});
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async update(id: string, updateUserDto: any) {
    try {
      return await this.userModel
        .updateOne({ userName: id }, updateUserDto)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err;
        });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async remove(id: string) {
    try {
      return await this.userModel.deleteOne({_id:id});
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
