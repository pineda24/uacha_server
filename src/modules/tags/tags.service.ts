import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './models/tag.model';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name)
    private tagsModel: ReturnModelType<typeof Tag>,
  ) {}

  async create(createTagDto: Tag) {
    try {
      const createTag = new this.tagsModel(createTagDto);
      return await createTag
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
    return `This action returns all tags`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
