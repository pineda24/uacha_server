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
      const { commentFather } = createCommentDto;
      const createUser = new this.commentModel(createCommentDto);
      let userCreated = await createUser.save();
      console.log(commentFather);
      if (commentFather) {
        await this.addComment({
          commentId: commentFather,
          subCommentId: userCreated._id.toString(),
        });
      }
      return userCreated;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findbyPostId(id: string) {
    try {
      let listComments: any = await this.commentModel.aggregate([
        // {
        //   $match: {
        //     $expr: {
        //       $eq: ['$postld', { $toObjectId: id }],
        //     },
        //   },
        // },
        // {
        //   $match: {
        //     $expr: {
        //       $eq: ['$commentFather', null],
        //     },
        //   },
        // },
        // {
        //   $lookup: {
        //     from: 'comments',
        //     localField: 'comments',
        //     foreignField: '_id',
        //     as: 'comments',
        //   },
        // },

        {
          $match: {
            $expr: {
              $eq: ['$postld', { $toObjectId: id }],
            },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userld',
            foreignField: '_id',
            as: 'users',
          },
        },
        {
          $project: {
            _id: 1,
            content: 1,
            date: 1,
            votes: 1,
            postld: 1,
            commentFather: 1,
            userName: {
              $cond: {
                if: {
                  $and: [{ $gt: [{ $size: '$users' }, 0] }],
                },
                then: { $arrayElemAt: ['$users.userName', 0] },
                else: null,
              },
            },
          },
        },
      ]);

      // Add list Comments
      for (let i = 0; i < listComments.length; i++) {
        listComments[i].comments = [];
        listComments[i].comments = listComments.filter(
          (obj) =>
            (obj.commentFather ? obj.commentFather.toString() : null) ==
            listComments[i]._id.toString(),
        );
      }

      // Delete subComments
      listComments = listComments.filter((obj) => obj.commentFather == null);

      return listComments;
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
      const { commentld, userld } = objectAdd;
      let objVoteUser = await this.commentModel.aggregate([
        {
          $match: {
            $expr: {
              $eq: ['$_id', { $toObjectId: commentld }],
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
        return await this.commentModel.findOne({ _id:commentld });
      } else {
        let user: any = await this.userModel.findOne({ _id: userld });
        return await this.commentModel.findByIdAndUpdate(
          { _id: commentld },
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
      const { commentld, userld } = objectAdd;
      return await this.commentModel.findByIdAndUpdate(
        { _id: commentld },
        { $pull: { upVotes: userld } },
        { upsert: true, new: true },
      );
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async addDownVotes(objectAdd: any) {
    try {
      const { commentld, userld } = objectAdd;
      let objVoteUser = await this.commentModel.aggregate([
        {
          $match: {
            $expr: {
              $eq: ['$_id', { $toObjectId: commentld }],
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
        return await this.commentModel.findOne({ _id:commentld });
      } else {
        let user: any = await this.userModel.findOne({ _id: userld });
        return await this.commentModel.findByIdAndUpdate(
          { _id: commentld },
          { $push: { downVotes: user } },
          { upsert: true, new: true },
        );
      }
      // let user: any = await this.userModel.findOne({ _id: userld });
      // return await this.commentModel.findByIdAndUpdate(
      //   { _id: commentld },
      //   { $push: { downVotes: user } },
      //   { upsert: true, new: true },
      // );
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async removeDownVotes(objectAdd: any) {
    try {
      const { commentld, userld } = objectAdd;
      let user: any = await this.userModel.findOne({ _id: userld });
      console.log(user);
      return await this.commentModel.findByIdAndUpdate(
        { _id: commentld },
        { $pull: { downVotes: user._id } },
        // { upsert: true, new: true },
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
