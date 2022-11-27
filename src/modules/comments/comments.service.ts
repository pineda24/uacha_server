import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from '../users/models/users.model';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './models/comment.model';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: ReturnModelType<typeof Comment>,
    @InjectModel(User.name)
    private userModel: ReturnModelType<typeof User>,
  ) {}

  async create(createCommentDto: Comment) {
    try {
      const createUser = new this.commentModel(createCommentDto);
      let userCreated = await createUser.save();
      return userCreated;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findByPostId(id: string) {
    try {
      let commentList = await this.commentModel.aggregate([
        {
          $match: {
            $expr: {
              $eq: ['$postId', { $toObjectId: id }],
            },
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
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'commentId',
            as: 'comments',
          },
        },
        {
          $unwind: {
            path: '$comments',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'comments.userId',
            foreignField: '_id',
            as: 'comments.user',
          },
        },
        {
          $unwind: {
            path: '$comments.user',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            content: 1,
            date: 1,
            postId: 1,
            upVotes: 1,
            downVotes: 1,
            hasVoteUp: {
              $in: [{ $toObjectId: '$userId' }, '$upVotes'],
            },
            hasDownVotes: {
              $in: [{ $toObjectId: '$userId' }, '$downVotes'],
            },
            user: { $arrayElemAt: ['$user', 0] },
            comments: 1,
          },
        },
        {
          $group: {
            _id: '$_id',
            content: { "$first": "$content" },
            date: { "$first": "$date" },
            postId: { "$first": "$postId" },
            upVotes: { "$first": "$upVotes" },
            downVotes: { "$first": "$downVotes" },
            hasVoteUp: { "$first": "$hasVoteUp" },
            hasDownVotes: { "$first": "$hasDownVotes" },
            user: { "$first": "$user" },
            comments: {$push: '$comments'}
          }
        }
      ]);
      return commentList;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async addComment(objectAdd: any) {
    try {
      const { commentId, subCommentId } = objectAdd;
      let comment: any = await this.commentModel.findOne({ _id: subCommentId });
      return await this.commentModel.findByIdAndUpdate(
        { _id: commentId },
        { $push: { comments: comment } },
        { upsert: true, new: true },
      );
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async removeComment(objectRemove: any) {
    try {
      const { commentId, subCommentId } = objectRemove;
      let comment: any = await this.commentModel.findOne({ _id: subCommentId });
      return await this.commentModel.findByIdAndUpdate(
        { _id: commentId },
        { $pull: { comments: comment } },
        { upsert: true, new: true },
      );
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async addVotesUp(objectAdd: any) {
    try {
      const { commentId, userId } = objectAdd;
      let objVoteUser = await this.commentModel.aggregate([
        {
          $match: {
            $expr: {
              $eq: ['$_id', { $toObjectId: commentId }],
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
        return await this.commentModel.findByIdAndUpdate(
          { _id: commentId },
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
      const { commentId, userId } = objectAdd;
      return await this.commentModel.findByIdAndUpdate(
        { _id: commentId },
        { $pull: { upVotes: userId } },
        { upsert: true, new: true },
      );
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async addDownVotes(objectAdd: any) {
    try {
      const { commentId, userId } = objectAdd;
      let objVoteUser = await this.commentModel.aggregate([
        {
          $match: {
            $expr: {
              $eq: ['$_id', { $toObjectId: commentId }],
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
        return await this.commentModel.findByIdAndUpdate(
          { _id: commentId },
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
      const { commentId, userId } = objectAdd;
      let user: any = await this.userModel.findOne({ _id: userId });
      return await this.commentModel.findByIdAndUpdate(
        { _id: commentId },
        { $pull: { downVotes: user._id } },
        { upsert: true, new: true },
      );
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findAll() {
    try {
      return await this.commentModel.find({});
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
