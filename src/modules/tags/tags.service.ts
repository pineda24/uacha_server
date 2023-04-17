import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Model } from 'mongoose';
import { Tag } from './interfaces/tag.interface';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel('Tag')
    private tagsModel: Model<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    try {
      const tag = new this.tagsModel(createTagDto);
      return await tag.save();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findTagsStadistics() {
    try {
      let objTags = {
        tags: [],
        popular: [],
        total: 0,
      };
      objTags.tags = await this.tagsModel.distinct('description');
      let popular =  await this.tagsModel.aggregate([
        {
          $lookup: {
            from: 'postmds',
            localField: '_id',
            foreignField: 'tags',
            as: 'total',
          },
        },
        {
          $project: {
            tag: '$description',
            total: {
              $cond: {
                if: {
                  $and: [{ $gt: [{ $size: '$total' }, 0] }],
                },
                then: { $size: '$total' },
                else: 0,
              },
            },
          },
        },
        {
          $sort: {
            total: -1,
          },
        },
      ]);
      let auxArray = popular.filter((month,idx) => idx < 3);
      objTags.popular = auxArray;
      for (let i = 0; i < auxArray.length; i++) {
        objTags.total += auxArray[i].total;
      }
      return objTags;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  findAll() {
    try {
      return this.tagsModel.find();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  async removeNotReferenced() {
    const referenced = await this.tagsModel.aggregate([
      {
        $lookup: {
          from: 'postmds',
          localField: '_id',
          foreignField: 'tags',
          as: 'tags',
        },
      },
      {
        $unwind: '$tags',
      },
      {
        $project: {
          _id: 1,
        },
      },
    ]);
    return await this.tagsModel.deleteMany({_id: {$nin: referenced}});
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
