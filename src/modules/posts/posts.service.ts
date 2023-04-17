import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Post } from './interfaces/post.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { TagsService } from '../tags/tags.service';
import { User } from '../users/interfaces/user.interface';
import { Comment } from '../comments/interfaces/comment.interface';
import { Tag } from '../tags/interfaces/tag.interface';

const ObjectId = mongoose.Types.ObjectId;

@Injectable()
export class PostsService {
  constructor(
    @InjectModel('Post')
    private readonly postModel: Model<Post>,
    @InjectModel('Tag')
    private readonly tagsModel: Model<Tag>,
    @InjectModel('User')
    private readonly userModel: Model<User>,
    @InjectModel('Comment')
    private readonly commentModel: Model<Comment>,
    private tagService: TagsService,
  ) {}

  async create(createPostDto: CreatePostDto) {
    try {
      const post = new this.postModel(createPostDto);
      return await post.save();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async addTags(objectAdd: any) {
    try {
      const { postId, description } = objectAdd;
      let tag = await this.tagsModel.findOne({ description: description });
      if (tag == undefined || tag == null) {
        tag = await this.tagService.create({ description: description });
      }
      const exist = await this.postModel.aggregate([
        {
          $match: {
            $expr: {
              $eq: ['$_id', { $toObjectId: postId }],
            },
          },
        },
        {
          $project: {
            tag: {
              $in: [{ $toObjectId: tag._id }, '$tags'],
            },
          },
        },
      ]);
      if (exist && exist.length > 0 && exist[0].tag == false) {
        return await this.postModel.findByIdAndUpdate(
          { _id: postId },
          { $push: { tags: tag } },
          { upsert: true, new: true },
        );
      } else {
        return {};
      }
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async removeTags(objectRemove: any) {
    try {
      const { postId, tagId } = objectRemove;
      let tag: any = await this.tagsModel.findOne({ _id: tagId });
      return await this.postModel.findByIdAndUpdate(
        { _id: postId },
        { $pull: { tags: tag } },
        { upsert: true, new: true },
      );
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findAllByUser(userId: string) {
    try {
      return await this.postModel.aggregate([
        {
          $match: { userId: new ObjectId(userId) },
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
            localField: 'categoryId',
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
            multimedia: 1,
            'category.title': 1,
            topic: 1,
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

  async findAll(category: string, topic: string) {
    try {
      return await this.postModel.aggregate([
        {
          $match: {
            $and: [{ categoryId: new ObjectId(category) }, { topic: topic }],
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
            localField: 'categoryId',
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
            multimedia: 1,
            'category.title': 1,
            topic: 1,
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

  async findAllWithTags(category: string, topic: string, arrayTags: any) {
    try {
      let tagsObjId = [];
      for (let i = 0; i < arrayTags.tags.length; i++) {
        tagsObjId.push(new ObjectId(arrayTags.tags[i]._id));
      }
      let objAggr: any = [
        {
          $match: {
            $and: [{ categoryId: new ObjectId(category) }, { topic: topic }],
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
      ];
      // Si manda varios Tags
      if (tagsObjId.length > 0) {
        objAggr.push({
          $match: {
            tags: {
              $elemMatch: {
                _id: {
                  $in: tagsObjId,
                },
              },
            },
          },
        });
      }
      objAggr.push(
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryId',
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
            multimedia: 1,
            'category.title': 1,
            topic: 1,
            tags: {
              $setUnion: '$tags.description',
            },
          },
        },
      );
      return await this.postModel.aggregate(objAggr);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findOne(id: string) {
    try {
      return await this.postModel.aggregate([
        {
          $match: { _id: new ObjectId(id) },
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
            from: 'users',
            localField: 'userId',
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
            multimedia: 1,
            tags: {
              $setUnion: '$tags.description',
            },
            upVotes: 1,
            downVotes: 1,
            userId: 1,
            topic: 1,
            hasVoteUp: {
              $in: [{ $toObjectId: '$userId' }, '$upVotes'],
            },
            hasDownVotes: {
              $in: [{ $toObjectId: '$userId' }, '$downVotes'],
            },
            user: { $arrayElemAt: ['$user', 0] },
          },
        },
      ]);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async addVotesUp(objectAdd: any) {
    try {
      const { postId, userId } = objectAdd;
      let objVoteUser = await this.postModel.aggregate([
        {
          $match: {
            $expr: {
              $eq: ['$_id', { $toObjectId: postId }],
            },
          },
        },
        {
          $project: {
            hasVoteUp: {
              $in: [{ $toObjectId: userId }, '$upVotes'],
            },
            hasDownVotes: {
              $in: [{ $toObjectId: userId }, '$downVotes'],
            },
          },
        },
      ]);
      if (objVoteUser && objVoteUser[0].hasDownVotes) {
        await this.removeDownVotes(objectAdd);
      }
      if (objVoteUser && objVoteUser[0].hasVoteUp) {
        return await this.removeVotesUp(objectAdd);
      } else {
        let user: any = await this.userModel.findOne({ _id: userId });
        return await this.postModel.findByIdAndUpdate(
          { _id: postId },
          { $push: { upVotes: user } },
          { upsert: true, new: true },
        );
      }
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async removeVotesUp(objectAdd: any) {
    try {
      const { postId, userId } = objectAdd;
      return await this.postModel.findByIdAndUpdate(
        { _id: postId },
        { $pull: { upVotes: userId } },
        { upsert: true, new: true },
      );
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async addDownVotes(objectAdd: any) {
    try {
      const { postId, userId } = objectAdd;
      let objVoteUser = await this.postModel.aggregate([
        {
          $match: {
            $expr: {
              $eq: ['$_id', { $toObjectId: postId }],
            },
          },
        },
        {
          $project: {
            hasVoteUp: {
              $in: [{ $toObjectId: userId }, '$upVotes'],
            },
            hasDownVotes: {
              $in: [{ $toObjectId: userId }, '$downVotes'],
            },
          },
        },
      ]);
      if (objVoteUser && objVoteUser[0].hasVoteUp) {
        await this.removeVotesUp(objectAdd);
      }
      if (objVoteUser && objVoteUser[0].hasDownVotes) {
        return await this.removeDownVotes(objectAdd);
      } else {
        let user: any = await this.userModel.findOne({ _id: userId });
        return await this.postModel.findByIdAndUpdate(
          { _id: postId },
          { $push: { downVotes: user } },
          { upsert: true, new: true },
        );
      }
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async removeDownVotes(objectAdd: any) {
    try {
      const { postId, userId } = objectAdd;
      return await this.postModel.findByIdAndUpdate(
        { _id: postId },
        { $pull: { downVotes: userId } },
        { upsert: true, new: true },
      );
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async updatePost(postId: string, post: any) {
    try {
      const tags = await this.tagsModel.aggregate([
        {
          $match: { description: { $in: post.tags } },
        },
        {
          $project: {
            _id: 1,
          },
        },
      ]);
      post.tags = [];
      tags.forEach((element) => {
        post.tags.push(element._id);
      });
      return await this.postModel
        .findOneAndUpdate({ _id: postId }, { $set: post })
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

  async deletePost(postId: string) {
    try {
      // Borramos los comentarios con el post asociado
      await this.commentModel.remove({ postId: postId });
      return await this.postModel.deleteOne({ _id: postId });
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
