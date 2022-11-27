import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Category } from './models/category.model';
import { PostMD } from '../posts/models/post.model';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: ReturnModelType<typeof Category>,
    @InjectModel(PostMD.name)
    private postModel: ReturnModelType<typeof PostMD>,
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

  async findOne(id: string) {
    try {
      return await this.categoryModel.findById(id);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async update(categoryId: string, category: any) {
    try {
      return await this.categoryModel.findOneAndUpdate({_id: categoryId}, {$set: category});
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async remove(categoryId: string) {
    try {
      const posts = await this.postModel.find({categoryId: categoryId})
      if (posts.length != 0) return null;
      return await this.categoryModel.deleteOne({_id: categoryId});
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
