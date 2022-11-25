import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { CommentsService } from '../comments/comments.service';
import { Tag } from '../tags/models/tag.model';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostMD } from './models/post.model';
import { User } from '../users/models/users.model';
import { TagsService } from '../tags/tags.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(PostMD.name)
    private postModel: ReturnModelType<typeof PostMD>,
    @InjectModel(Tag.name)
    private tagsModel: ReturnModelType<typeof Tag>,
    @InjectModel(User.name)
    private userModel: ReturnModelType<typeof User>,
    private commentService: CommentsService,
    private tagService: TagsService,
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
      const { postld, description } = objectAdd;
      let tag = await this.tagsModel.findOne({ description: description });
      if (tag == undefined || tag == null) {
        tag = await this.tagService.create({ description: description });
      }
      let exist = await this.postModel.aggregate([
        {
          $match: {
            $expr: {
              $eq: ['$_id', { $toObjectId: postld }],
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
          { _id: postld },
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

  async findOne(id: string, obj: any) {
    const { userld } = obj;
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
            upVotes: 1,
            downVotes: 1,
            hasVoteUp: {
              $in: [{ $toObjectId: userld }, '$upVotes'],
            },
            hasDownVotes: {
              $in: [{ $toObjectId: userld }, '$downVotes'],
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
      if (post && post.length > 0) {
        post[0].comments = await this.commentService.findbyPostId(
          post[0]._id,
          userld,
        );
        return post[0];
      }
      return null;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async addVotesUp(objectAdd: any) {
    try {
      const { postld, userld } = objectAdd;
      let objVoteUser = await this.postModel.aggregate([
        {
          $match: {
            $expr: {
              $eq: ['$_id', { $toObjectId: postld }],
            },
          },
        },
        {
          $project: {
            hasVoteUp: {
              $in: [{ $toObjectId: userld }, '$upVotes'],
            },
            hasDownVotes: {
              $in: [{ $toObjectId: userld }, '$downVotes'],
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
        let user: any = await this.userModel.findOne({ _id: userld });
        return await this.postModel.findByIdAndUpdate(
          { _id: postld },
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
      const { postld, userld } = objectAdd;
      return await this.postModel.findByIdAndUpdate(
        { _id: postld },
        { $pull: { upVotes: userld } },
        { upsert: true, new: true },
      );
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async addDownVotes(objectAdd: any) {
    try {
      const { postld, userld } = objectAdd;
      let objVoteUser = await this.postModel.aggregate([
        {
          $match: {
            $expr: {
              $eq: ['$_id', { $toObjectId: postld }],
            },
          },
        },
        {
          $project: {
            hasVoteUp: {
              $in: [{ $toObjectId: userld }, '$upVotes'],
            },
            hasDownVotes: {
              $in: [{ $toObjectId: userld }, '$downVotes'],
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
        let user: any = await this.userModel.findOne({ _id: userld });
        return await this.postModel.findByIdAndUpdate(
          { _id: postld },
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
      const { postld, userld } = objectAdd;
      return await this.postModel.findByIdAndUpdate(
        { _id: postld },
        { $pull: { downVotes: userld } },
        { upsert: true, new: true },
      );
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
