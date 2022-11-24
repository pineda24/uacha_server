import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Tag } from '../tags/models/tag.model';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostMD } from './models/post.model';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(PostMD.name)
    private postModel: ReturnModelType<typeof PostMD>,
    @InjectModel(Tag.name)
    private tagsModel: ReturnModelType<typeof Tag>,
  ) {}

  async create(createPostDto: PostMD) {
    try {
      const createUser = new this.postModel(createPostDto);
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

  async addTags(objectAdd: any) {
    try {
      const { postld, tagld } = objectAdd;
      let tag: any = await this.tagsModel.findOne({ _id: tagld });
      return await this.postModel.findByIdAndUpdate(
        { _id: postld },
        { $push: { tags: tag } },
        { upsert: true, new: true },
      );
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async removeTags(objectRemove: any) {
    try {
      const { postld, tagld } = objectRemove;
      let tag: any = await this.tagsModel.findOne({ _id: tagld });
      return await this.postModel.findByIdAndUpdate(
        { _id: postld },
        { $pull: { tags: tag } },
        { upsert: true, new: true },
      );
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findAll() {
    try {
      // return await this.postModel.find({});
      return await this.postModel.aggregate([
        {
          $lookup: {
            from: 'tags',
            localField: 'tags',
            foreignField: '_id',
            as: 'tags',
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryld',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            content: 1,
            date: 1,
            votes: 1,
            multimedia: 1,
            categoryld: 1,
            category: {
              $cond: {
                if: {
                  $and: [{ $gt: [{ $size: '$category' }, 0] }],
                },
                then: { $arrayElemAt: ['$category', 0] },
                else: null,
              },
            },
            tags: {
              $setUnion: '$tags.description',
            },
          },
        },
      ]);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findOne(id: string) {
    try {
      let post = await this.postModel.aggregate([
        {
          $match: {
            $expr: {
              $eq: ['$_id', { $toObjectId: id }],
            },
          },
        },
        {
          $lookup: {
            from: 'tags',
            localField: 'tags',
            foreignField: '_id',
            as: 'tags',
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryld',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userld',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            content: 1,
            date: 1,
            votes: 1,
            multimedia: 1,
            categoryld: 1,
            category: {
              $cond: {
                if: {
                  $and: [{ $gt: [{ $size: '$category' }, 0] }],
                },
                then: { $arrayElemAt: ['$category', 0] },
                else: null,
              },
            },
            tags: {
              $setUnion: '$tags.description',
            },
            user: {
              $cond: {
                if: {
                  $and: [{ $gt: [{ $size: '$user' }, 0] }],
                },
                then: { $arrayElemAt: ['$user', 0] },
                else: null,
              },
            },
          },
        },
      ]);
      if(post && post.length > 0) return post[0];
      return null;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
