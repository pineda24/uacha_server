import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../posts/interfaces/post.interface';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category')
    private categoryModel: Model<Category>,
    @InjectModel('Post')
    private postModel: Model<Post>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = new this.categoryModel(createCategoryDto);
      return await category.save();
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

  async update(categoryId: string, category: UpdateCategoryDto) {
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
