import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Topic } from './models/topic.model';

@Injectable()
export class TopicsService {

  constructor(
    @InjectModel( Topic.name )
    private topicModel: ReturnModelType<typeof Topic>,
  ) {}

  async create(createTopicDto: Topic) {
    try {
      const createCategory = new this.topicModel(createTopicDto);
      return await createCategory
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

  async findAll() {
    try {
      return await this.topicModel.find({});
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} topic`;
  }

  update(id: number, updateTopicDto: UpdateTopicDto) {
    return `This action updates a #${id} topic`;
  }

  remove(id: number) {
    return `This action removes a #${id} topic`;
  }
}
