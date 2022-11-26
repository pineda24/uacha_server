import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Topic } from '../topics/models/topic.model';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './models/category.model';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: ReturnModelType<typeof Category>,
    @InjectModel(Topic.name)
    private topicModel: ReturnModelType<typeof Topic>,
  ) {}

  async create(createCategoryDto: Category) {
    try {
      const createCategory = new this.categoryModel(createCategoryDto);
      return await createCategory.save();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findAll() {
    try {
      return await this.categoryModel.find();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findAllWithTopics() {
    try {
      return await this.categoryModel.aggregate([
        {
          $lookup: {
            from: 'topics',
            localField: 'topics',
            foreignField: '_id',
            as: 'topics',
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            topics: {
              $setUnion: '$topics.description',
            },
          },
        },
      ]);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async addTopic(objectAdd: any) {
    try {
      const { categoryld, topicld } = objectAdd;
      let topic: any = await this.topicModel.findOne({ _id: topicld });
      return await this.categoryModel.findByIdAndUpdate(
        { _id: categoryld },
        { $push: { topics: topic } },
        { upsert: true, new: true },
      );
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async removeTopic(objectRemove: any) {
    try {
      const { categoryld, topicld } = objectRemove;
      let topic: any = await this.topicModel.findOne({ _id: topicld });
      return await this.categoryModel.findByIdAndUpdate(
        { _id: categoryld },
        { $push: { topics: topic } },
        { upsert: true, new: true },
      );
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findOne(id: string) {
    try {
      return await this.categoryModel.findById(id);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
