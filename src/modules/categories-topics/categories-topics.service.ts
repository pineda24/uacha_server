import { Injectable } from '@nestjs/common';
import { CreateCategoriesTopicDto } from './dto/create-categories-topic.dto';
import { UpdateCategoriesTopicDto } from './dto/update-categories-topic.dto';

@Injectable()
export class CategoriesTopicsService {
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
