import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateCategoriesTopicDto } from './dto/create-categories-topic.dto';
import { UpdateCategoriesTopicDto } from './dto/update-categories-topic.dto';
import { CategoryTopic } from './models/categoryTopic.model';

@Injectable()
export class CategoriesTopicsService {

  constructor(
    @InjectModel(CategoryTopic.name)
    private categoryTopicModel: ReturnModelType<typeof CategoryTopic>,
  ) {}

  create(createCategoriesTopicDto: CreateCategoriesTopicDto) {
    return 'This action adds a new categoriesTopic';
  }

  findAll() {
    return `This action returns all categoriesTopics`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categoriesTopic`;
  }

  update(id: number, updateCategoriesTopicDto: UpdateCategoriesTopicDto) {
    return `This action updates a #${id} categoriesTopic`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoriesTopic`;
  }
}
