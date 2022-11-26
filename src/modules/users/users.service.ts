import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from './models/users.model';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)
    private userModel: ReturnModelType<typeof User>,
  ) {}

  async create(createUserDto: User) {
    try {
      const createUser = new this.userModel(createUserDto);
      return await createUser
        .save()
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

  async login(objLogin: any){
    const {userName,password} = objLogin;
    try {
      let user = await this.userModel.findOne({userName: userName,password:password });
      return user;
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

  async findOne(id: string) {
    try {
      return await this.userModel.findOne({_id:id});
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
      // console.log(updateEmployeeDto);
      let { fullName,email,gender,birthDate,description,userName,password } =
        updateUserDto;
      let user = new User();
      // user.fullName = fullName ? fullName : "";
      // user.email = email ? email : "";
      // user.gender = gender ? gender : "";
      // user.birthDate = birthDate ? birthDate : new Date();
      // user.description = description ? description : "";
      // user.userName = userName ? userName : "";

      //GENRATE PASSWORD
      // user.password = password ? password : "";
      console.log(updateUserDto);
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
